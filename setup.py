from setuptools import setup, find_packages

requires = [
    'pyramid',
    'sqlalchemy',
    'transaction',
    'pyramid_tm',
    'pyramid_retry',
    'pyramid_debugtoolbar',
    'zope.sqlalchemy',
    'waitress',
]

setup(
    name='matakuliah_app',
    version='0.1',
    description='Aplikasi Manajemen Matakuliah dengan Pyramid',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    entry_points="""\
    [paste.app_factory]
    main = matakuliah_app:main
    """,
)