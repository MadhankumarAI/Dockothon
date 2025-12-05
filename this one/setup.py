from setuptools import setup, find_packages

setup(
    name="uroflow_cv",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "opencv-python>=4.5.0",
        "numpy>=1.20.0",
        "scipy>=1.7.0",
        "matplotlib>=3.4.0",
        "pandas>=1.3.0"
    ],
    entry_points={
        'console_scripts': [
            'run_uroflow=scripts.run_analysis:main',
        ],
    },
)
