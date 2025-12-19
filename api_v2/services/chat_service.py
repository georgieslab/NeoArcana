"""
Chat service - AI conversation about tarot readings
"""
import logging
import uuid
from datetime import datetime
from typing import Dict, List
from anthropic import AsyncAnthropic
from google.cloud import firestore

from api_v2.utils.cosmic_utils import getLanguageForClaude

logger = logging.getLogger(__name__)


class ChatService:
    """Service for handling chat conversations"""
    
    def __init__(self, database):
        self.db = database
        # Initialize async Anthropic client
        from api_v2.core.config import settings
        self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    async def start_chat_session(
        self,
        name: str,
        zodiac_sign: str,
        language: str,
        nfc_id: str,
        card_name: str = None,
        reading: str = None,
        is_premium: bool = False
    ) -> Dict:
        """
        Start a new chat session with welcome message
        """
        try:
            # Generate session ID
            session_id = str(uuid.uuid4())
            
            # Create welcome message
            if is_premium:
                welcome_msg = (
                    f"Hi {name}! I'm here to discuss your premium three-card reading "
                    f"representing your past, present, and future. What would you like to know more about?"
                )
            else:
                welcome_msg = (
                    f"Hi {name}! I'm here to discuss your tarot reading "
                    f"with the {card_name} card. What would you like to know more about?"
                )
            
            # Translate if not English
            if language != 'en':
                welcome_msg = await self._translate_message(welcome_msg, language)
            
            # Create session in Firebase
            session_data = {
                'session_id': session_id,
                'nfc_id': nfc_id,
                'name': name,
                'zodiac_sign': zodiac_sign,
                'language': language,
                'card_name': card_name,
                'reading': reading,
                'is_premium': is_premium,
                'created_at': datetime.now(),
                'messages': [
                    {
                        'role': 'assistant',
                        'content': welcome_msg,
                        'timestamp': datetime.now()
                    }
                ]
            }
            
            # Save to Firebase
            session_ref = self.db.collection('chat_sessions').document(session_id)
            session_ref.set(session_data)
            
            logger.info(f"Chat session started: {session_id} for {name}")
            
            return {
                'success': True,
                'response': welcome_msg,
                'session_id': session_id
            }
            
        except Exception as e:
            logger.error(f"Error starting chat session: {e}")
            raise
    
    async def send_message(
        self,
        session_id: str,
        message: str,
        name: str,
        zodiac_sign: str,
        language: str,
        reading: str = None,
        card_name: str = None,
        message_history: List[Dict] = None
    ) -> Dict:
        """
        Send a message and get AI response
        """
        try:
            # Get session from Firebase
            session_ref = self.db.collection('chat_sessions').document(session_id)
            session_doc = session_ref.get()
            
            if not session_doc.exists:
                logger.warning(f"Session {session_id} not found, creating new one")
                # If session doesn't exist, treat as new conversation
                message_history = []
            else:
                session_data = session_doc.to_dict()
                # Get history from session if not provided
                if message_history is None:
                    message_history = session_data.get('messages', [])
            
            # Build system prompt
            system_prompt = self._build_system_prompt(
                name=name,
                zodiac_sign=zodiac_sign,
                reading=reading,
                card_name=card_name,
                language=language
            )
            
            # Format messages for Claude
            claude_messages = []
            
            # Add previous messages
            for msg in message_history:
                if isinstance(msg, dict) and 'role' in msg and 'content' in msg:
                    role = "assistant" if msg['role'] == 'assistant' else "user"
                    claude_messages.append({
                        "role": role,
                        "content": msg['content']
                    })
            
            # Add current message
            claude_messages.append({
                "role": "user",
                "content": message
            })
            
            logger.info(f"Sending chat request with {len(claude_messages)} messages")
            
            # Call Claude API (ASYNC!)
            response = await self.client.messages.create(
                model="claude-sonnet-4-20250514",  # Latest model!
                max_tokens=1000,
                system=system_prompt,
                messages=claude_messages
            )
            
            ai_response = response.content[0].text
            
            # Save messages to session
            await self._save_messages_to_session(
                session_id=session_id,
                user_message=message,
                ai_response=ai_response
            )
            
            logger.info(f"Chat response generated for session {session_id}")
            
            return {
                'success': True,
                'response': ai_response
            }
            
        except Exception as e:
            logger.error(f"Error in chat: {e}")
            raise
    
    def _build_system_prompt(
        self,
        name: str,
        zodiac_sign: str,
        reading: str,
        card_name: str,
        language: str
    ) -> str:
        """Build system prompt for chat"""
        
        prompt = f"""You are a friendly and knowledgeable tarot reader having an ongoing conversation with {name}, 
who is a {zodiac_sign}. Their reading was: {reading}"""
        
        if card_name:
            prompt += f"\nThe card drawn was: {card_name}"
        
        prompt += f"""

Important guidelines:
1. You are continuing an existing conversation - do not introduce yourself again
2. Maintain conversation flow naturally
3. Keep responses focused on the tarot reading and user's zodiac sign
4. Respond in {getLanguageForClaude(language)} language
5. Keep responses concise but meaningful (2-3 paragraphs maximum)
6. Be warm, supportive, and insightful
7. Reference their specific cards and cosmic context when relevant
8. Avoid being overly mysterious - be helpful and clear"""
        
        return prompt
    
    async def _translate_message(self, message: str, language: str) -> str:
        """Translate message to target language"""
        try:
            translate_prompt = f"Translate this message to {getLanguageForClaude(language)}: {message}"
            
            response = await self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=500,
                messages=[{"role": "user", "content": translate_prompt}]
            )
            
            return response.content[0].text
            
        except Exception as e:
            logger.error(f"Translation error: {e}")
            # Return original if translation fails
            return message
    
    async def _save_messages_to_session(
        self,
        session_id: str,
        user_message: str,
        ai_response: str
    ):
        """Save messages to Firebase session"""
        try:
            session_ref = self.db.collection('chat_sessions').document(session_id)
            
            # Add messages to array
            session_ref.update({
                'messages': firestore.ArrayUnion([
                    {
                        'role': 'user',
                        'content': user_message,
                        'timestamp': datetime.now()
                    },
                    {
                        'role': 'assistant',
                        'content': ai_response,
                        'timestamp': datetime.now()
                    }
                ]),
                'last_activity': datetime.now()
            })
            
            logger.info(f"Messages saved to session {session_id}")
            
        except Exception as e:
            logger.error(f"Error saving messages: {e}")
            # Don't fail the request if saving fails
    
    async def get_session_history(self, session_id: str) -> List[Dict]:
        """Get chat history for a session"""
        try:
            session_ref = self.db.collection('chat_sessions').document(session_id)
            session_doc = session_ref.get()
            
            if session_doc.exists:
                session_data = session_doc.to_dict()
                return session_data.get('messages', [])
            
            return []
            
        except Exception as e:
            logger.error(f"Error getting session history: {e}")
            return []