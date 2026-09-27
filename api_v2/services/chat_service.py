"""
Chat service - AI conversation about tarot readings with Amazon Bedrock support
"""
import logging
import uuid
import asyncio
from datetime import datetime
from typing import Dict, List, Optional
import boto3
from anthropic import AsyncAnthropic

from api_v2.core.config import settings
from api_v2.utils.cosmic_utils import getLanguageForClaude

logger = logging.getLogger(__name__)


class ChatService:
    """Service for handling chat conversations powered by Amazon Bedrock or Anthropic"""

    def __init__(self, database):
        self.db = database
        self.local_sessions: Dict[str, Dict] = {}

        # Initialize optional Anthropic client
        if settings.ANTHROPIC_API_KEY:
            self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        else:
            self.client = None

    async def _call_chat_ai(self, system_prompt: str, messages: List[Dict]) -> str:
        """Invoke AI provider (Amazon Bedrock or Anthropic) with conversation history"""
        # 1. Prefer Amazon Bedrock
        if settings.AI_PROVIDER == 'bedrock':
            try:
                def _invoke_bedrock():
                    client_kwargs = {
                        'service_name': 'bedrock-runtime',
                        'region_name': settings.AWS_REGION or 'eu-north-1',
                    }
                    if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
                        client_kwargs['aws_access_key_id'] = settings.AWS_ACCESS_KEY_ID
                        client_kwargs['aws_secret_access_key'] = settings.AWS_SECRET_ACCESS_KEY

                    bedrock_client = boto3.client(**client_kwargs)
                    model_id = settings.BEDROCK_MODEL_ID or 'deepseek.v3.2'

                    # Convert messages to Bedrock Converse format
                    converse_messages = []
                    for msg in messages:
                        role = "assistant" if msg.get('role') == 'assistant' else "user"
                        text_val = msg.get('content', '')
                        if text_val:
                            converse_messages.append({
                                "role": role,
                                "content": [{"text": str(text_val)}]
                            })

                    # If messages is empty, provide a fallback user turn
                    if not converse_messages:
                        converse_messages = [{
                            "role": "user",
                            "content": [{"text": "Hello, speak to me of my tarot spread."}]
                        }]

                    logger.info(f"Bedrock Chat: invoking {model_id} with {len(converse_messages)} messages")
                    response = bedrock_client.converse(
                        modelId=model_id,
                        messages=converse_messages,
                        system=[{"text": system_prompt}],
                        inferenceConfig={
                            "maxTokens": 1000,
                            "temperature": 0.7
                        }
                    )
                    return response['output']['message']['content'][0]['text']

                loop = asyncio.get_running_loop()
                return await loop.run_in_executor(None, _invoke_bedrock)
            except Exception as e:
                logger.error(f"Bedrock chat invocation failed: {e}")
                if not (self.client and settings.ANTHROPIC_API_KEY):
                    # Return graceful cosmic AI answer instead of crashing
                    return (
                        "The celestial currents are swirling intensely right now. "
                        "Reflect upon the cards drawn: your inner intuition holds the compass. "
                        "What direction does your heart instinctively pull you toward?"
                    )

        # 2. Try Anthropic Claude if available
        if self.client and settings.ANTHROPIC_API_KEY:
            try:
                claude_msgs = []
                for msg in messages:
                    role = "assistant" if msg.get('role') == 'assistant' else "user"
                    claude_msgs.append({
                        "role": role,
                        "content": str(msg.get('content', ''))
                    })
                response = await self.client.messages.create(
                    model="claude-3-haiku-20240307",
                    max_tokens=1000,
                    system=system_prompt,
                    messages=claude_msgs
                )
                return response.content[0].text
            except Exception as e:
                logger.error(f"Anthropic chat call failed: {e}")

        return (
            "The cosmic portal remains open. Trust the synchronicity of your cards: "
            "what was once hidden is gently emerging into your awareness."
        )

    async def start_chat_session(
        self,
        name: str = "Seeker",
        zodiac_sign: str = "Cosmic Seeker",
        language: str = "en",
        nfc_id: Optional[str] = None,
        card_name: Optional[str] = None,
        reading: Optional[str] = None,
        is_premium: bool = False
    ) -> Dict:
        """Start a new chat session with a personalized cosmic opening"""
        try:
            session_id = str(uuid.uuid4())

            welcome_msg = (
                f"Greetings, {name} of the stars! ✨ "
                f"I am the Cosmic Oracle tuned to your reading. "
                f"Your cards have illuminated a path—what questions or reflections stir in your heart?"
            )

            # Store in session state
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
                        'timestamp': datetime.now().isoformat()
                    }
                ]
            }

            self.local_sessions[session_id] = session_data

            if self.db:
                try:
                    self.db.collection('chat_sessions').document(session_id).set(session_data)
                except Exception as e:
                    logger.warning(f"Failed to persist chat session to Firestore: {e}")

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
        session_id: Optional[str],
        message: str,
        name: str = "Seeker",
        zodiac_sign: str = "Cosmic Seeker",
        language: str = "en",
        reading: Optional[str] = None,
        card_name: Optional[str] = None,
        message_history: Optional[List[Dict]] = None
    ) -> Dict:
        """Send a message and get Bedrock AI response with full spread context"""
        try:
            if not session_id:
                session_id = str(uuid.uuid4())

            # Retrieve prior messages
            history = []
            if session_id in self.local_sessions:
                history = self.local_sessions[session_id].get('messages', [])
            elif message_history:
                history = message_history

            # Build system prompt with complete reading and zodiac context
            system_prompt = self._build_system_prompt(
                name=name,
                zodiac_sign=zodiac_sign,
                reading=reading,
                card_name=card_name,
                language=language
            )

            # Build messages array for Bedrock
            conversation_messages = []
            for msg in history:
                if isinstance(msg, dict) and 'role' in msg and 'content' in msg:
                    conversation_messages.append({
                        'role': msg['role'],
                        'content': msg['content']
                    })

            conversation_messages.append({
                'role': 'user',
                'content': message
            })

            logger.info(f"Generating Bedrock chat response for session {session_id}")
            ai_response = await self._call_chat_ai(system_prompt, conversation_messages)

            # Save to history
            updated_messages = conversation_messages + [{
                'role': 'assistant',
                'content': ai_response
            }]

            if session_id not in self.local_sessions:
                self.local_sessions[session_id] = {
                    'session_id': session_id,
                    'name': name,
                    'zodiac_sign': zodiac_sign,
                    'messages': []
                }
            self.local_sessions[session_id]['messages'] = updated_messages

            if self.db:
                try:
                    self.db.collection('chat_sessions').document(session_id).update({
                        'messages': updated_messages,
                        'last_activity': datetime.now()
                    })
                except Exception as e:
                    logger.warning(f"Could not update Firestore session: {e}")

            return {
                'success': True,
                'response': ai_response,
                'session_id': session_id
            }

        except Exception as e:
            logger.error(f"Error in send_message: {e}")
            raise

    def _build_system_prompt(
        self,
        name: str,
        zodiac_sign: str,
        reading: Optional[str],
        card_name: Optional[str],
        language: str
    ) -> str:
        """Build celestial oracle system prompt"""
        prompt = f"""You are the Cosmic Arcana Oracle, a deeply wise, warm, and intuitive spiritual guide.
You are in a sacred conversation with {name or 'Seeker'}, whose astrological sign is {zodiac_sign or 'a seeker of light'}.

SACRED SPREAD CONTEXT:
Card/Spread: {card_name or 'Three-Card Past, Present, Future'}
Interpretation Details:
{reading or 'A profound three-card journey of reflection and transformation.'}

CRITICAL GUIDELINES:
1. Speak directly as the Oracle with warmth, poetic cosmic imagery, and profound emotional intelligence.
2. Directly reference their cards (Past, Present, Future) and how they relate to the user's specific inquiry.
3. Keep answers concise, inspiring, and actionable (2-3 paragraphs maximum).
4. Never break character. Never state you are an AI model. You are the voice of the cosmos reflecting their cards.
5. Respond entirely in {getLanguageForClaude(language)} language."""

        return prompt

    async def get_session_history(self, session_id: str) -> List[Dict]:
        """Get chat history for a session"""
        if session_id in self.local_sessions:
            return self.local_sessions[session_id].get('messages', [])
        if self.db:
            try:
                doc = self.db.collection('chat_sessions').document(session_id).get()
                if doc.exists:
                    return doc.to_dict().get('messages', [])
            except Exception as e:
                logger.error(f"Error getting session history: {e}")
        return []