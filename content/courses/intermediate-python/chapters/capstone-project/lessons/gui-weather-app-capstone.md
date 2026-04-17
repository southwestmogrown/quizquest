---
lessonSlug: gui-weather-app-capstone
title: "Capstone: GUI Weather Lookup"
type: code
xpReward: 30
estimatedMinutes: 20
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Weather Lookup GUI — Capstone Project
        #
        # Build a Tkinter GUI that:
        # 1. Has an Entry widget for the user to type a city name
        # 2. A "Look Up" button that fetches weather for that city
        # 3. Displays the weather info in labels below
        #
        # Use the wttr.in API (no API key needed):
        #   GET https://wttr.in/{city}?format=j1
        #   Returns JSON with current_condition, area, country, etc.
        #
        # Expected output in the console (not the GUI):
        # "Fetching weather for London..."
        # "Weather: Partly cloudy, 18°C"
        # "Location: London, United Kingdom"
        #
        # The starter code sets up the GUI layout. Fill in the callbacks.

        import tkinter as tk
        import requests

        print("Fetching weather for London...")

        root = tk.Tk()
        root.title("Weather Lookup")
        root.geometry("400x250")

        # ---- Header ----
        tk.Label(root, text="Weather Lookup", font=("Arial", 16, "bold")).pack(pady=10)

        # ---- Input row ----
        input_frame = tk.Frame(root)
        input_frame.pack(pady=10)

        tk.Label(input_frame, text="City:").pack(side="left", padx=5)
        city_entry = tk.Entry(input_frame, width=30)
        city_entry.pack(side="left", padx=5)
        city_entry.insert(0, "London")

        # ---- Result labels ----
        weather_label = tk.Label(root, text="", font=("Arial", 12))
        weather_label.pack(pady=5)

        location_label = tk.Label(root, text="", font=("Arial", 10))
        location_label.pack(pady=5)

        # ---- Status ----
        status_label = tk.Label(root, text="", font=("Arial", 9), fg="gray")
        status_label.pack(pady=5)

        # ---- Callback ----
        def on_lookup():
            city = city_entry.get().strip()
            if not city:
                status_label.config(text="Please enter a city name.")
                return

            try:
                # Fetch weather from wttr.in
                url = f"https://wttr.in/{city}?format=j1"
                response = requests.get(url, timeout=5)
                response.raise_for_status()
                data = response.json()

                current = data["current_condition"][0]
                temp_C = current["temp_C"]
                weather_desc = current["weatherDesc"][0]["value"]

                area = data["nearest_area"][0]["areaName"][0]["value"]
                country = data["nearest_area"][0]["country"][0]["value"]

                # Update labels
                weather_label.config(text=f"Weather: {weather_desc}, {temp_C}°C")
                location_label.config(text=f"Location: {area}, {country}")
                status_label.config(text="")

                # Console output
                print(f"Weather: {weather_desc}, {temp_C}°C")
                print(f"Location: {area}, {country}")

            except requests.RequestException as e:
                status_label.config(text=f"Error: {e}")
                weather_label.config(text="")
                location_label.config(text="")

        # ---- Lookup button ----
        tk.Button(root, text="Look Up", command=on_lookup, font=("Arial", 11)).pack(pady=10)

        root.mainloop()
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
          - id: weather
            type: stdout_contains
            expected: "Weather:"
          - id: location
            type: stdout_contains
            expected: "Location:"
---

# Capstone: GUI Weather Lookup

The starter code already contains the full GUI and API fetching logic. Run it locally to see the weather app in action.

**What it does:**
1. Type a city name (defaults to "London")
2. Click "Look Up" to fetch weather from the free wttr.in API
3. The GUI updates with weather description, temperature, and location
4. Console prints the same information

**To run locally:**
```
python main.py
```

A window will appear. Type any city name (try "Paris", "Tokyo", "New York") and click Look Up.

**How to extend it:**
- Add a "Forecast" button to show the 3-day forecast
- Add error handling for unknown city names
- Save recent searches to a history list
- Display weather icons using Pillow (`PIL`)

This capstone combines Tkinter GUI, event callbacks, `tk.StringVar`, HTTP API calls, and error handling — everything you learned in this course.
