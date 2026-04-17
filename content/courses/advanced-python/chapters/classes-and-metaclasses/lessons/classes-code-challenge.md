---
lessonSlug: classes-code-challenge
title: "Code Challenge: Animal Class Hierarchy"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Animal Class Hierarchy Challenge
        #
        # Build this class hierarchy:
        #
        # Animal (base class)
        #   ├── Dog
        #   │   └── Labrador (subclass of Dog)
        #   └── Cat
        #       └── Persian (subclass of Cat)
        #
        # Requirements:
        # 1. Animal.__init__(name) — sets self.name
        # 2. Animal.speak() — abstract, returns NotImplementedError
        # 3. Dog.speak() — returns "Buddy says woof!" where Buddy is the dog's name
        # 4. Cat.speak() — returns "Whiskers says meow!" where Whiskers is the cat's name
        # 5. Labrador — inherits from Dog, overrides speak() to return "{name} says WOOF!"
        # 6. Persian — inherits from Cat, overrides speak() to return "{name} says prrr..."
        # 7. Dog.__repr__ — returns "Dog(name='...')"
        # 8. Cat.__repr__ — returns "Cat(name='...')"
        # 9. Use @dataclass for Animal
        # 10. Add a DogPark class with a method `add_animal(animal)` and `all_speak()`
        #     that collects all animals' names and what they say.
        #
        # Expected output:
        # Dog(name='Buddy')
        # Cat(name='Whiskers')
        # Buddy says woof!
        # Whiskers says meow!
        # Max says WOOF!
        # Fluffy says prrr...
        # Park residents: Buddy (woof!), Whiskers (meow!), Max (WOOF!), Fluffy (prrr...)

        from dataclasses import dataclass

        # ---- Animal ----
        # TODO: @dataclass with name: str
        # TODO: speak() method that raises NotImplementedError

        # ---- Dog (inherits from Animal) ----
        # TODO: inherit from Animal
        # TODO: speak() returns f"{self.name} says woof!"
        # TODO: __repr__ returns f"Dog(name='{self.name}')"

        # ---- Labrador (inherits from Dog) ----
        # TODO: speak() returns f"{self.name} says WOOF!"

        # ---- Cat (inherits from Animal) ----
        # TODO: speak() returns f"{self.name} says meow!"
        # TODO: __repr__ returns f"Cat(name='{self.name}')"

        # ---- Persian (inherits from Cat) ----
        # TODO: speak() returns f"{self.name} says prrr..."

        # ---- DogPark ----
        # TODO: animals: list = field(default_factory=list)
        # TODO: add_animal(animal) — appends to animals list
        # TODO: all_speak() — prints: "Park residents: name1 (speak1!), name2 (speak2!), ..."

        # ---- Test ----
        buddy = Dog("Buddy")
        whiskers = Cat("Whiskers")
        max_dog = Labrador("Max")
        fluffy = Persian("Fluffy")

        print(repr(buddy))
        print(repr(whiskers))
        print(buddy.speak())
        print(whiskers.speak())
        print(max_dog.speak())
        print(fluffy.speak())

        park = DogPark()
        for animal in [buddy, whiskers, max_dog, fluffy]:
            park.add_animal(animal)
        park.all_speak()
  run:
    entrypoint: main.py
  grading:
    passingScorePercent: 100
    groups:
      - id: runs
        name: Runs without errors
        weight: 30
        visibility: hidden
        tests:
          - id: exit-ok
            type: exit_code
            expected: 0
      - id: output
        name: Correct output
        weight: 70
        visibility: summary
        tests:
          - id: repr-dog
            type: stdout_contains
            expected: "Dog(name='Buddy')"
          - id: repr-cat
            type: stdout_contains
            expected: "Cat(name='Whiskers')"
          - id: buddy-speak
            type: stdout_contains
            expected: "Buddy says woof!"
          - id: max-speak
            type: stdout_contains
            expected: "Max says WOOF!"
          - id: park
            type: stdout_contains
            expected: "Park residents:"
---

# Code Challenge: Animal Class Hierarchy

Build the class hierarchy described in `main.py`. Implement all the classes and methods as specified in the comments.

Key requirements:
- Use `@dataclass` for `Animal` (Python 3.7+)
- Labrador inherits from Dog and overrides `speak()` to use "WOOF!" (uppercase)
- Persian inherits from Cat and overrides `speak()` to use "prrr..."
- DogPark uses `add_animal()` to collect animals and `all_speak()` to list them

Run `python main.py` to see your hierarchy in action.
