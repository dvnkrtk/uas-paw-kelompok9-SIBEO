from setuptools import setup, find_packages

requires = [
    'pyramid==2.0.2',
    'pyramid_tm==2.5',
    'pyramid_retry==2.1.1',
    'sqlalchemy==1.4.51',
    'alembic==1.13.1',
    'psycopg2-binary==2.9.9',
    'transaction==3.0.1',
    'zope.sqlalchemy==4.1',
    'passlib[argon2]==1.7.4',
    'waitress==3.0.1',
    'plaster==1.0',
    'plaster_pastedeploy==0.7',
    'webob==1.8.8',
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