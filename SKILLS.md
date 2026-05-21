# skills.md — Research Pilot Study Generator

## Role
You are acting as a senior research analyst and technical literature reviewer for an engineering startup-research project called **AgroSense**.

Your task is to read and analyze ALL PDF research papers present inside the `/papers` directory and generate a deeply structured, research-oriented **Pilot Study / Literature Review document**.

The folder contains approximately 17 research papers.

---

# Project Context — AgroSense

AgroSense is a low-cost precision agriculture system designed for Indian smallholder farmers.

The system combines:

- UAV photogrammetry
- RGB crop-stress analysis
- Edge AI
- Cloud + Edge architecture
- ESP32 embedded systems
- Ground sensor fusion
- GPS-guided soil sampling
- Firebase telemetry
- IoT dashboards
- Machine-learning-based NPK estimation
- Precision agriculture workflows

Current architecture includes:
- UAV-based aerial scouting
- Cloud orthomosaic processing
- ESP32-based soil sensing
- RS485 Modbus soil probes
- Firebase + ThingSpeak integration
- Edge inference using Random Forest models
- Human-guided waypoint navigation
- Cloud dashboard visualization

The literature review MUST stay aligned with this system architecture and startup direction.

---

# Main Objective

Generate a **Pilot Study Report** from all PDFs inside `/papers`.

The report should help:
1. Understand current state-of-the-art research
2. Identify architectural patterns
3. Extract useful techniques
4. Compare cloud vs edge approaches
5. Identify research gaps
6. Improve AgroSense system design
7. Build a strong IEEE-style literature review foundation

---

# Required Output Structure

Create a file:

`pilot_study.md`

with the following structure.

---

# 1. Cover Title

# Pilot Study and Literature Review
## Cloud–Edge Precision Agriculture Systems for AgroSense

Include:
- date
- total papers analyzed
- main research domains

---

# 2. Master Summary Table (VERY IMPORTANT)

Create a structured markdown table containing ALL papers.

Columns:
| No | Paper Title | Year | Publisher | Main Focus | Cloud / Edge / Hybrid | Key Contribution | Relevance to AgroSense |

This table should become the quick-reference overview for the entire pilot study.

---

# 3. Individual Paper Analysis

For EACH paper generate:

## Paper X — [Title]

### Basic Metadata
- Authors
- Publisher
- Year
- DOI / Link

### Research Problem
Explain what problem the paper solves.

### Core Architecture
Describe:
- system design
- data flow
- cloud-edge interaction
- sensor architecture
- AI/ML pipeline
- communication stack

### Technologies Used
Mention:
- ESP32
- Raspberry Pi
- Jetson
- MQTT
- Firebase
- Kubernetes
- TinyML
- TensorFlow Lite
- UAV systems
- sensors
- cloud stack
etc. if present.

### Key Contributions
Bullet list of major contributions.

### Methodology
Explain:
- models
- datasets
- experiments
- evaluation strategy
- deployment approach

### Important Findings
Summarize outcomes and technical insights.

### Limitations
Identify:
- scalability issues
- latency issues
- hardware dependency
- lack of field testing
- cloud cost
- power constraints
etc.

### Relevance to AgroSense
MOST IMPORTANT SECTION.

Explicitly connect the paper to:
- AgroSense architecture
- UAV pipeline
- sensor fusion
- ESP32 deployment
- edge inference
- telemetry
- precision agriculture workflow
- dashboard systems
- cloud-edge integration
- farmer usability
- scalability

### Possible Implementation Ideas
Suggest:
- modules
- algorithms
- workflows
- optimizations
that AgroSense can adopt.

---

# 4. Thematic Grouping

After all papers are analyzed, group them into categories such as:

- Edge AI Systems
- Cloud Agriculture Platforms
- UAV-based Monitoring
- Sensor Fusion Systems
- TinyML / Embedded ML
- IoT Telemetry Systems
- Precision Agriculture Frameworks
- Distributed Edge Architectures
- Real-time Monitoring Systems
- Smart Irrigation / Fertigation
- Autonomous Navigation

For each category:
- summarize trends
- compare approaches
- explain engineering tradeoffs

---

# 5. Comparative Analysis

Create comparison tables such as:

## Architecture Comparison
| Paper | Architecture Type | Edge Device | Cloud Platform | ML Type | Real-time Support |

## Communication Stack Comparison
| Paper | MQTT | HTTP | LoRa | WiFi | Cellular | BLE |

## AI Deployment Comparison
| Paper | Cloud AI | Edge AI | Hybrid AI | TinyML | On-device inference |

---

# 6. Research Gaps

Identify:
- unsolved problems
- limitations in current research
- gaps in low-cost agriculture systems
- deployment problems in Indian farming environments
- limitations in cloud-edge collaboration
- issues with smallholder economics

Focus heavily on:
- affordability
- low-power systems
- intermittent connectivity
- low-cost sensing
- edge intelligence
- explainability
- real-world deployment

---

# 7. Opportunities for AgroSense

Generate:
- architectural recommendations
- future features
- scalable design ideas
- cloud-edge optimization ideas
- data pipeline improvements
- sensor fusion improvements
- UAV intelligence improvements
- edge AI optimization ideas
- product differentiation opportunities

This section should feel like:
“how AgroSense can become better than existing systems.”

---

# 8. Suggested Final Architecture

Using insights from ALL papers:
Design an improved architecture for AgroSense.

Include:
- edge layer
- cloud layer
- AI layer
- telemetry layer
- UAV layer
- sensor layer
- dashboard layer
- future scalability layer

Make it detailed and engineering-oriented.

---

# 9. Final Conclusion

Summarize:
- major learnings
- strongest research directions
- key innovations
- implementation priorities for AgroSense

The conclusion should feel like a strong IEEE-style research synthesis.

---

# Important Instructions

- Read ALL PDFs from `/papers`
- Do NOT skip any paper
- Maintain technical depth
- Be engineering-oriented
- Prefer structured analysis over generic summaries
- Write professionally like a real literature review
- Avoid shallow explanations
- Maintain consistency across all paper analyses
- Extract architecture-level insights wherever possible
- Prioritize practical deployment learnings
- Focus heavily on cloud-edge collaboration systems

---

# Output Quality

The final document should feel like:
- a research-grade pilot study
- startup R&D groundwork
- IEEE literature review preparation
- system architecture research synthesis

Depth > brevity.

Use markdown formatting cleanly.