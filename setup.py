from setuptools import setup, find_packages

requires = [
    'pyramid',
    'sqlalchemy',
    'alembic',           # Database migration
    'psycopg2-binary',   # PostgreSQL adapter
    'transaction',
    'pyramid_tm',
    'pyramid_retry',
    'pyramid_debugtoolbar',
    'zope.sqlalchemy',
    'waitress',
    'passlib[argon2]',   # Untuk password hashing - TAMBAHAN TAHAP 2
]

dev_requires = [
    'pyramid_debugtoolbar',
]

setup(
    name='e_learning',
    version='0.1',
    description='Platform E-Learning dengan Pyramid Framework',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    extras_require={
        'dev': dev_requires,
    },
    entry_points="""\
    [paste.app_factory]
    main = e_learning:main
    """,
)
