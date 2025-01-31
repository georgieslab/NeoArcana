import os
from typing import List, Dict
import json
from datetime import datetime

class ProjectMapper:
    """A simple tool to map your project directory structure"""
    
    def __init__(self, root_path: str, ignore_dirs: List[str] = None):
        """Initialize ProjectMapper"""
        self.root_path = root_path
        self.ignore_dirs = ignore_dirs or [
            'node_modules',
            '__pycache__',
            '.venv',
            '.git',
            '.idea',
            'build',
            'data',
            'logs',
            'venv',
            'dist',
            'temp',
            'tmp'
        ]
        
    def create_map(self) -> Dict:
        """Create a dictionary representation of the directory structure"""
        return self._walk_dir(self.root_path)
            
    def _walk_dir(self, current_path: str) -> Dict:
        """Recursively walk through directories"""
        items = {}
            
        try:
            # Get all items in current directory
            for item in sorted(os.listdir(current_path)):
                # Skip ignored directories and hidden files
                if item in self.ignore_dirs or item.startswith('.'):
                    continue
                    
                full_path = os.path.join(current_path, item)
                
                # If it's a directory, recurse into it
                if os.path.isdir(full_path):
                    sub_items = self._walk_dir(full_path)
                    if sub_items:  # Only add non-empty directories
                        items[item + '/'] = sub_items
                else:
                    # Store file with its extension
                    items[item] = None
                    
        except Exception as e:
            print(f"Error accessing {current_path}: {e}")
            
        return items
    
    def save_map(self, output_file: str = 'project_map.json'):
        """Save the directory map to a JSON file"""
        try:
            directory_map = {
                'project_map': self.create_map(),
                'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'root_directory': self.root_path,
                'ignored_directories': self.ignore_dirs
            }
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(directory_map, f, indent=2)
                
            print(f"Directory map saved to {output_file}")
            
        except Exception as e:
            print(f"Error saving map: {e}")
    
    def print_map(self):
        """Print the directory structure in a tree-like format"""
        def print_tree(data: Dict, prefix: str = '', is_last: bool = True):
            """Recursively print tree structure"""
            if not data:
                return
                
            items = list(data.items())
            
            for i, (name, subtree) in enumerate(items):
                is_last_item = i == len(items) - 1
                
                # Print current item
                print(f"{prefix}{'└── ' if is_last_item else '├── '}{name}")
                
                # If it's a directory (has subtree), print its contents
                if subtree is not None:
                    new_prefix = prefix + ('    ' if is_last_item else '│   ')
                    print_tree(subtree, new_prefix)
        
        print(f"\nProject Structure for: {self.root_path}")
        print(f"Ignored directories: {', '.join(self.ignore_dirs)}\n")
        
        map_data = self.create_map()
        if map_data:
            print_tree(map_data)
        else:
            print("No accessible files found in directory.")

if __name__ == "__main__":
    # Get the current directory
    current_dir = os.getcwd()
    
    # Create mapper instance
    mapper = ProjectMapper(current_dir)
    
    # Print the directory structure
    mapper.print_map()
    
    # Save to JSON file
    mapper.save_map('cosmic_tarot_structure.json')