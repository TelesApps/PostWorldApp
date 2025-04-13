# Terrain Attributes Reference

## `terrain_rsi` (Relative Strength Index)

- **Explanation:** Indicates how common a particular terrain type is across the globe. Think of it as a frequency or prevalence rating.
- **Range:** 1 to 100
- **Interpretation:**
  - A lower number means the terrain is rare.
  - A higher number means the terrain is common.

---

## `possible_ylocations`

- **Explanation:** Represents the relative geographic positioning of a terrain type with respect to the equator.
- **Range:** 1 to 5
- **Interpretation:**
  - **1:** Terrain typically found near or on the poles (very far from the equator).
  - **5:** Terrain is common near or on the equator (closer to the center of the globe).
- **Usage:** Determines the likelihood of a terrain appearing at various latitudes.

---

## `possible_hill_lvl`

- **Explanation:** Describes the topography or elevation changes present in the terrain.
- **Range:** 0 to 2
- **Interpretation:**
  - **0:** Very flat terrain, like an open plain or swamp.
  - **1:** Small to moderately high hills.
  - **2:** Mountainous terrain, often with features like snowcapped peaks.

---

## `possible_forestry_lvl`

- **Explanation:** Shows how densely vegetated a terrain is, particularly regarding tree coverage.
- **Range:** 1 to 3
- **Interpretation:**
  - **1:** Very sparse vegetation (similar to desert landscapes).
  - **2:** Moderate vegetation—not as dense as a forest.
  - **3:** Highly dense vegetation, typical of jungles or rainforests.

---

## `possible_temperature_lvl`

- **Explanation:** Approximates the climate temperature for the terrain.
- **Range:** 1 to 5
- **Interpretation:**
  - **1:** Extremely cold, similar to Arctic regions.
  - **5:** Extremely hot, akin to Furnace Creek in Death Valley, California.
- **Usage:** Helps simulate realistic climate variation and its impact on terrain features.

---

## `possible_rainfall_lvl`

- **Explanation:** Denotes how much precipitation the terrain receives.
- **Range:** 1 to 5
- **Interpretation:**
  - **1:** Extremely dry (like a super dry desert), with very little rainfall.
  - **5:** Very wet, almost flooded, with heavy and frequent rainfall.
- **Usage:** Affects both visual appearance (e.g., dry or lush landscapes) and gameplay elements related to water availability and ecosystem.
