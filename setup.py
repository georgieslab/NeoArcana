
from setuptools import setup, find_packages

setup(
    name="tarot-app",
    version="3.0.0",
    packages=find_packages(),
    install_requires=[
        'anthropic',
        'flask',
        'python-dotenv',
        'google-cloud-firestore'
    ],
)