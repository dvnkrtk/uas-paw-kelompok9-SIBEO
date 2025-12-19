import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- ABSOLUTE PATH FIX ---
# Dapatkan absolute path ke root project
current_file = os.path.abspath(__file__)  # C:\...\src\alembic\env.py
alembic_dir = os.path.dirname(current_file)  # C:\...\src\alembic
src_dir = os.path.dirname(alembic_dir)       # C:\...\src
root_dir = os.path.dirname(src_dir)          # C:\...\ (root project)

# Tambahkan root project ke sys.path
sys.path.insert(0, root_dir)

# Import models Base - sekarang harusnya bisa
from e_learning.models import Base

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # Handle database URL from development.ini if alembic.ini doesn't have it
    alembic_ini_url = config.get_main_option("sqlalchemy.url")
    
    if not alembic_ini_url or 'example' in alembic_ini_url:
        # Try to get URL from development.ini
        from pyramid.paster import get_appsettings
        try:
            settings = get_appsettings('config/development.ini')
            db_url = settings.get('sqlalchemy.url')
            if db_url:
                config.set_main_option("sqlalchemy.url", db_url)
        except:
            pass

    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()