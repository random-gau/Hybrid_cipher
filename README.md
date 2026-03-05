# Hybrid Cipher Encryption System

A multi-stage encryption pipeline demonstrating classical cryptographic algorithms with a modern web interface.

## Features
- **Multi-Stage Pipeline**: Chains Playfair, Vigenère, and Columnar Transposition ciphers.
- **Key Strength Indicator**: Provides feedback on key complexity.
- **Interactive UI**: Simple dashboard for encryption and decryption.
- **Bi-Directional**: Supports both encryption and decryption flows.

## Encryption Flow
Plaintext → Playfair → Vigenère → Columnar Transposition → Ciphertext

## Decryption Flow
Ciphertext → Reverse Columnar → Reverse Vigenère → Reverse Playfair → Plaintext

## Tech Stack
- React
- Vite
- JavaScript
- CSS

## Running the Application

1. Navigate to the project directory