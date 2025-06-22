
import os
import json
from pathlib import Path

def scan_directory(directory_path, exclude_dirs=None):
    """Scan a directory and return a dictionary representing its structure."""
    if exclude_dirs is None:
        exclude_dirs = ['node_modules']
    
    structure = {}
    
    # Get all entries in the directory
    for entry in os.scandir(directory_path):
        # Skip excluded directories
        if entry.is_dir() and entry.name in exclude_dirs:
            continue
            
        if entry.is_file():
            # Store file information
            structure[entry.name] = {
                'type': 'file',
                'size': entry.stat().st_size,
                'path': str(Path(entry.path).absolute())
            }
        elif entry.is_dir():
            # Recursively scan subdirectories
            structure[entry.name] = {
                'type': 'directory',
                'path': str(Path(entry.path).absolute()),
                'contents': scan_directory(entry.path, exclude_dirs)
            }
    
    return structure

def generate_report(structure, output_file='project_structure.json'):
    """Generate a report of the directory structure."""
    with open(output_file, 'w') as f:
        json.dump(structure, f, indent=2)
    
    print(f"Project structure saved to {output_file}")

def print_structure(structure, indent=0):
    """Print the directory structure in a tree-like format."""
    for name, info in sorted(structure.items()):
        print('  ' * indent + f"├── {name}")
        if info['type'] == 'directory' and 'contents' in info:
            print_structure(info['contents'], indent + 1)

def main():
    # Get the current directory or ask user for input
    project_dir = input("Enter the project directory path (or press Enter for current directory): ")
    
    if not project_dir:
        project_dir = os.getcwd()
    
    # Directories to exclude
    exclude_dirs = ['node_modules', '.git', '__ pycache__', 'venv'] 
    
    # Scan the directory
    print(f"Scanning directory: {project_dir}")
    print(f"Excluding: {', '.join(exclude_dirs)}")
    
    structure = {os.path.basename(project_dir): {
        'type': 'directory',
        'path': str(Path(project_dir).absolute()),
        'contents': scan_directory(project_dir, exclude_dirs)
    }}
    
    # Generate report
    generate_report(structure)
    
    # Print structure to console
    print("\nProject structure:")
    print_structure(structure)
    
    return structure

if __name__ == "__main__":
    main()