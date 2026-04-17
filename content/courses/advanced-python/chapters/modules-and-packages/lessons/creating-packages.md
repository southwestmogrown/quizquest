---
lessonSlug: creating-packages
title: Creating Packages
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Creating Packages

## What Is a Package?

A **package** is a directory containing `__init__.py` and Python modules. It lets you organize code into a hierarchical namespace:

```
mypackage/
    __init__.py       # package initialization
    utils.py          # mypackage.utils
    models/
        __init__.py
        user.py       # mypackage.models.user
```

## The `__init__.py` File

`__init__.py` runs when the package is imported. It can:
- Set `__all__` to control exports
- Import key classes/functions for convenient access
- Initialize package-level state

```python
# mypackage/__init__.py
from .utils import helper_function
from .models.user import User

__all__ = ["User", "helper_function"]
```

Now users can do:
```python
from mypackage import User, helper_function  # convenient
from mypackage.models.user import User       # still works
```

## Relative Imports

Inside a package, use `.` to refer to the current package:

```python
# mypackage/models/user.py
from ..utils import helper_function  # go up one level → mypackage.utils
from . import UserProfile           # same level → mypackage.models.user.UserProfile
```

## Entry Points with `pyproject.toml`

For installable packages, use `pyproject.toml`:

```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "mypackage"
version = "0.1.0"
```

Then `pip install -e .` installs the package in editable mode.

## Virtual Environments

Always use a virtual environment to isolate package installations:

```bash
python -m venv .venv
source .venv/bin/activate    # Linux/macOS
# .venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

* * *

Next: building and testing a small utility package.
