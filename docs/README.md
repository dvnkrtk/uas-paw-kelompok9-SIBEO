# SIBEO 
Aplikasi E-Learning modern yang dibangun dengan React, memungkinkan student untuk membrowse dan enroll courses, serta instructor untuk membuat dan mengelola course content.

## Tech Stack
- **Framework**: Pyramid
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migration**: Alembic
- **Server**: Waitress

## Setup Development

### 1. Prerequisites
- Python 3.8+
- PostgreSQL 12+
- pip & virtualenv

### 2. Installation
```bash
# Clone repository
git clone <repo-url>

# Install dependencies
pip install -e .

# Create PostgreSQL database
createdb -U postgres e_learning_dev

# Run migrations
python -m alembic upgrade head

# Run application
cd src
pserve config/development.ini
