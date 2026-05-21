# Pilot Study and Literature Review
## Cloud-Edge Precision Agriculture Systems for AgroSense

- Date: 2026-05-07
- Total papers analyzed: 17
- Main research domains: precision agriculture, UAV monitoring, ESP32/IoT telemetry, edge-fog-cloud architecture, TinyML, LPWAN/5G connectivity, smart irrigation, sensor fusion, farmer decision support, and cloud dashboards.

# 1. Cover Title

This pilot study synthesizes the local PDF corpus in `papers/` for AgroSense, a low-cost precision agriculture system for Indian smallholder farmers. The review focuses on practical architecture lessons: what belongs on ESP32-class devices, what should run at a gateway or fog node, what should be pushed to the cloud, and how UAV scouting and ground sensing can become a coherent product workflow.

# 2. Master Summary Table

| No | Paper Title | Year | Publisher | Main Focus | Cloud / Edge / Hybrid | Key Contribution | Relevance to AgroSense |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | A Feasible IoT-Based System for Precision Agriculture | 2016 | IEEE | low-cost field monitoring for precision agriculture and viticulture | Hybrid | Demonstrates a feasible low-cost IoT monitoring architecture for precision agriculture. | This paper maps closely to AgroSense's ESP32 soil-sensing and telemetry layer. |
| 2 | A Pilot Study of Smart Agricultural Irrigation using Unmanned Aerial Vehicles and IoT-Based Cloud System | 2021 | International Journal of Information Sciences Letters | UAV-assisted smart irrigation and cloud-based water requirement estimation | Hybrid | Combines UAV mobility with IoT sensing for irrigation planning. | This is one of the strongest matches for AgroSense's UAV photogrammetry and ground-sensor fusion direction. |
| 3 | Chatbot Application to Support Smart Agriculture in Thailand | 2020 | IEEE | farmer decision support using a LINE chatbot and cultivation knowledge | Cloud | Adds conversational decision support to smart agriculture workflows. | AgroSense should not only produce maps and sensor charts; it should translate them into simple farmer actions. |
| 4 | Edge-Based Predictive Data Reduction for Smart Agriculture: A Lightweight Approach to Efficient IoT Communication | 2025 | Research paper / conference-style manuscript | edge-side predictive filtering to reduce redundant IoT transmissions | Hybrid | Reduces communication overhead with a lightweight edge prediction filter. | This is directly useful for ESP32 nodes that send soil moisture, NPK, pH, EC, and temperature to Firebase/ThingSpeak. |
| 5 | Energy-Efficient Edge-Fog-Cloud Architecture for IoT-Based Smart Agriculture Environment | 2021 | IEEE Access | energy-efficient multi-tier edge-fog-cloud smart agriculture architecture | Hybrid | Defines an integrated edge-fog-cloud architecture for smart agriculture. | AgroSense can use this as its reference architecture: ESP32 nodes as edge, a phone/Raspberry Pi/Jetson gateway as fog, and Firebase/cloud processing for dashboards and historical analytics. |
| 6 | Everything You Wanted to Know About Smart Agriculture | 2022 | arXiv preprint | broad smart agriculture survey, architectures, applications, datasets, networking, and challenges | Hybrid | Provides a broad taxonomy of smart agriculture technologies and applications. | This paper gives AgroSense its broad literature map. |
| 7 | A Fog-Based Smart Agriculture System to Detect Animal Intrusion | 2023 | Research paper / IEEE-style manuscript | low-cost fog and LoRa animal intrusion detection | Hybrid | Presents an end-to-end fog-based farm intrusion detection infrastructure. | AgroSense can adopt the fog-first alerting pattern for pest/animal/security events. |
| 8 | IoT-Aerial Base Station Task Offloading with Risk-Sensitive Reinforcement Learning for Smart Agriculture | 2022 | IEEE Transactions on Green Communications and Networking / arXiv | UAV/aerial base station task offloading with risk-sensitive reinforcement learning | Edge | Models smart-farm computation offloading to aerial base stations. | AgroSense can use this concept in a lighter way: UAVs or mobile gateways can temporarily act as data mules or compute nodes for fields without connectivity, especially during scouting missions. |
| 9 | A LoRa-IoT Framework with Machine Learning for Remote Livestock Monitoring in Smart Agriculture | 2025 | arXiv preprint | LoRa livestock tracking, health monitoring, anomaly detection, and cloud analytics | Hybrid | Presents AgroTrack, a low-power LoRa framework for livestock monitoring. | AgroSense can reuse the LoRa gateway design for remote plots where WiFi is unrealistic. |
| 10 | Machine Learning Applications in IoT Based Agriculture and Smart Farming: A Review | 2020 | International Journal of Engineering Applied Sciences and Technology | review of ML and IoT applications in smart agriculture | Hybrid | Reviews IoT and ML approaches in agriculture. | This supports AgroSense's Random Forest NPK estimation direction and broader sensor-fusion analytics. |
| 11 | Online Processing of Vehicular Data on the Edge Through an Unsupervised TinyML Regression Technique | 2023 | ACM Transactions / ACM manuscript | unsupervised TinyML regression for edge streaming data | Edge | Introduces an unsupervised TinyML regression technique for edge streams. | AgroSense can adapt this class of TinyML technique for on-device soil-moisture trend prediction, anomaly detection, or sensor fault detection on ESP32-class devices. |
| 12 | An Ontological Knowledge Representation for Smart Agriculture | 2022 | IEEE-style conference paper | ontology and knowledge graph representation for spatio-temporal agriculture data | Cloud | Defines an ontology-oriented smart agriculture knowledge model. | AgroSense can use an ontology-lite design for its dashboard: field, plot, crop, sensor, UAV image, soil sample, NPK estimate, recommendation, and farmer action should be linked explicitly. |
| 13 | Reliable and Cost-Efficient IoT Connectivity for Smart Agriculture: A Comparative Study of LPWAN, 5G, and Hybrid Connectivity Models | 2025 | Research paper / review manuscript | LPWAN, 5G, and hybrid connectivity tradeoffs for smart agriculture | Hybrid | Compares LPWAN and cellular options for farm connectivity. | This is central to AgroSense scaling. |
| 14 | Simulating Battery-Powered TinyML Systems Optimised using Reinforcement Learning in Image-Based Anomaly Detection | 2024 | TinyML / research preprint | RL-based battery optimization for TinyML image anomaly detection | Hybrid | Optimizes TinyML system operations with RL for battery life. | AgroSense can use RL-style or simpler adaptive policies for when ESP32/edge cameras should sample, infer, train, transmit, or sleep. |
| 15 | Smart Agriculture Architecture and Current State in India | 2021 | International Journal of Technology, Management & Knowledge Processing | IoT smart agriculture framework and Indian deployment context | Hybrid | Frames the role of IoT in Indian smart agriculture. | This paper anchors AgroSense's startup context: Indian farmers need affordable, usable, locally maintainable tools. |
| 16 | Smart Agriculture: Implementing IoT for Greenhouse Monitoring | 2024 | Turku University of Applied Sciences bachelor thesis | ESP32 greenhouse monitoring with MQTT, AWS, MongoDB, and Angular | Hybrid | Implements a complete greenhouse IoT monitoring prototype. | This is highly practical for AgroSense's embedded and dashboard stack. |
| 17 | Survey of Intelligent Agricultural IoT Based on 5G | 2023 | Electronics, MDPI | 5G-enabled intelligent agricultural IoT survey | Hybrid | Summarizes the architecture and enabling technologies of 5G agricultural IoT. | AgroSense should be 5G-ready without being 5G-dependent. |

# 3. Individual Paper Analysis

## Paper 1 - A Feasible IoT-Based System for Precision Agriculture

### Basic Metadata
- Authors: Radovan Stojanovic, Vesna Maras, Sanja Radonjic, Anita Martic, Jovan Durkovic, Katarina Pavicevic, Vasilije Mirovic and collaborators
- Publisher: IEEE
- Year: 2016
- DOI / Link: 10.1109/MIS.2015.67
- Local PDF: `papers/A Feasible IoT-Based System for Precision Agriculture.pdf`

### Research Problem
The paper addresses the practical problem of giving farmers a low-cost, remotely accessible way to monitor field and crop conditions without expensive industrial SCADA infrastructure.

### Core Architecture
A self-powered measuring station gathers field parameters and forwards them to a nearby collector. The collector bridges the farm node to home or office WiFi and then to an IoT server such as ThingSpeak. The architecture is simple but important: local acquisition, gateway forwarding, cloud visualization, and web/API-based access for authorized users.

### Technologies Used
Self-powered sensor station, remote collector, WiFi, commercial IoT server, ThingSpeak APIs, web applications, field sensors for viticulture monitoring.

### Key Contributions
- Demonstrates a feasible low-cost IoT monitoring architecture for precision agriculture.
- Separates field sensing from Internet connectivity through a collector/gateway.
- Uses an accessible public IoT server model for visualization and farmer access.

### Methodology
The authors design and deploy a field/crop data acquisition setup, route data through a collector, and validate feasibility through remote visualization and control concepts.

### Important Findings
The main finding is that precision-agriculture monitoring can be implemented with inexpensive distributed components when cloud visualization is decoupled from the constrained field node.

### Limitations
The work is monitoring-heavy, has limited AI, limited autonomy, and does not deeply address intermittent connectivity, edge inference, data fusion, or Indian smallholder economics.

### Relevance to AgroSense
This paper maps closely to AgroSense's ESP32 soil-sensing and telemetry layer. The collector/gateway idea can be reused for villages where field nodes cannot directly reach the Internet. ThingSpeak-style visualization is similar to the current Firebase/ThingSpeak direction, while AgroSense can extend the design with RS485 Modbus probes, GPS-tagged samples, and edge Random Forest inference.

### Possible Implementation Ideas
- Use a gateway tier between ESP32 sensor nodes and Firebase when direct WiFi is unreliable.
- Keep ThingSpeak as a low-friction backup dashboard for early pilots.
- Add store-and-forward buffering in the collector to tolerate field connectivity loss.

## Paper 2 - A Pilot Study of Smart Agricultural Irrigation using Unmanned Aerial Vehicles and IoT-Based Cloud System

### Basic Metadata
- Authors: Mohamed Esmail Karar, Faris Alotaibi, Abdullah Al Rasheed, Omar Reyad
- Publisher: International Journal of Information Sciences Letters
- Year: 2021
- DOI / Link: 10.18576/isl/100115
- Local PDF: `papers/A Pilot Study of Smart Agricultural Irrigation using Unmanned aerial vehicle and iot based cloud systems.pdf`

### Research Problem
The paper targets inefficient irrigation, wasted water, and poor spatial awareness in farms where fixed sensing alone may not capture condition differences across regions.

### Core Architecture
Environmental sensors measure temperature, humidity, and soil moisture. A UAV collects readings from different farm regions and sends the data into a cloud system. The cloud computes irrigation quantities for each region and exposes farm status through an Android application, while water pumps execute irrigation actions.

### Technologies Used
UAV, Arduino boards, WiFi modules, water pumps, temperature sensors, humidity sensors, soil-moisture sensors, cloud computing, Android app.

### Key Contributions
- Combines UAV mobility with IoT sensing for irrigation planning.
- Uses cloud computation to calculate water requirements by farm region.
- Shows a mobile application workflow for farmer-facing irrigation guidance.

### Methodology
The study implements a prototype using embedded boards, sensors, pumps, UAV data collection, cloud computation, and mobile monitoring, then evaluates whether irrigation waste can be reduced.

### Important Findings
The system demonstrates that UAV-assisted sensing can improve spatial coverage and cloud logic can guide more precise irrigation than manual methods.

### Limitations
The architecture depends on UAV availability, cloud connectivity, and relatively simple control logic. It does not deeply cover edge failover, flight planning constraints, or low-cost mass deployment.

### Relevance to AgroSense
This is one of the strongest matches for AgroSense's UAV photogrammetry and ground-sensor fusion direction. AgroSense can combine aerial crop-stress imagery with ESP32 soil-moisture/NPK readings, then use cloud orthomosaic outputs and Firebase telemetry to drive irrigation or sampling recommendations.

### Possible Implementation Ideas
- Use UAV missions to fill spatial gaps between fixed soil probes.
- Create zone-level irrigation recommendations by fusing RGB stress maps with soil-moisture readings.
- Expose water recommendations in the AgroSense dashboard with farmer-readable priority levels.

## Paper 3 - Chatbot Application to Support Smart Agriculture in Thailand

### Basic Metadata
- Authors: Paweena Suebsombut, Suepphong Chernbumroong, Pradorn Sureephong, Abdelaziz Bouras, Aicha Sekhari
- Publisher: IEEE
- Year: 2020
- DOI / Link: 10.1109/ECTIDAMTNCON48261.2020.90906
- Local PDF: `papers/Chatbot Application to Support Smart Agriculture.pdf`

### Research Problem
Most smart agriculture systems stop at sensing and dashboards; this paper addresses the gap between raw IoT data and actionable cultivation knowledge for farmers.

### Core Architecture
The system uses a chatbot as the user interface. Smart agriculture information and cultivation knowledge are represented behind the chatbot, which answers farmer questions and delivers recommendations through LINE.

### Technologies Used
LINE chatbot, knowledge representation, smart agriculture data, mobile messaging interface, recommendation support.

### Key Contributions
- Adds conversational decision support to smart agriculture workflows.
- Emphasizes crop-cultivation knowledge rather than sensor display alone.
- Uses a familiar messaging interface to reduce adoption friction.

### Methodology
The authors design a chatbot application and knowledge flow for responding to crop-cultivation questions in the context of smart agriculture.

### Important Findings
Conversational access can make smart-agriculture systems more usable by presenting recommendations where farmers already communicate.

### Limitations
The work is less focused on sensing architecture, edge computing, and quantitative agronomic validation. It depends heavily on knowledge-base quality.

### Relevance to AgroSense
AgroSense should not only produce maps and sensor charts; it should translate them into simple farmer actions. A chatbot layer could explain why a zone needs sampling, irrigation, pest inspection, or fertilizer correction using Firebase data and UAV stress outputs.

### Possible Implementation Ideas
- Add WhatsApp/LINE-style advisory messages for stress zones and NPK alerts.
- Generate local-language explanations from dashboard events.
- Convert model outputs into question-answer flows for field operators.

## Paper 4 - Edge-Based Predictive Data Reduction for Smart Agriculture: A Lightweight Approach to Efficient IoT Communication

### Basic Metadata
- Authors: Dora Krekovic, Mario Kusek, Ivana Podnar Zarko, Danh Le-Phuoc
- Publisher: Research paper / conference-style manuscript
- Year: 2025
- DOI / Link: Not specified in PDF
- Local PDF: `papers/Edge-Based Predictive Data Reduction cost effective.pdf`

### Research Problem
Continuous IoT transmission wastes bandwidth and battery because many agriculture sensor readings change slowly over time.

### Core Architecture
A predictive model runs at the edge and estimates the next sensor reading. The node transmits only when measured data deviates from prediction beyond a tolerance. A complementary cloud model reconstructs or validates the expected stream to preserve system consistency.

### Technologies Used
Edge predictive filter, cloud-side mirror model, in situ sensor observations, satellite observations, IoT communication protocols, simulation validation.

### Key Contributions
- Reduces communication overhead with a lightweight edge prediction filter.
- Maintains cloud consistency through a dual-model edge/cloud strategy.
- Uses both local and satellite observations to improve robustness.

### Methodology
The paper validates predictive reduction through simulation, testing tolerance-based transmission and cross-site model deployment.

### Important Findings
The approach can cut redundant communication while preserving enough fidelity for downstream analytics, making it attractive for battery-powered field deployments.

### Limitations
Tolerance selection is application-sensitive. Abnormal agronomic events may be hidden if thresholds are poorly chosen. Real hardware and farmer-facing validation remain important.

### Relevance to AgroSense
This is directly useful for ESP32 nodes that send soil moisture, NPK, pH, EC, and temperature to Firebase/ThingSpeak. AgroSense can reduce cloud writes, bandwidth, and power use by transmitting only meaningful changes or model residuals.

### Possible Implementation Ideas
- Add edge-side delta/prediction filters before Firebase uploads.
- Mirror prediction logic in the cloud so missing samples are reconstructable.
- Use stricter thresholds during crop-stress events and looser thresholds during stable periods.

## Paper 5 - Energy-Efficient Edge-Fog-Cloud Architecture for IoT-Based Smart Agriculture Environment

### Basic Metadata
- Authors: Hatem A. Alharbi, Mohammad Aldossary
- Publisher: IEEE Access
- Year: 2021
- DOI / Link: 10.1109/ACCESS.2021.3101397
- Local PDF: `papers/energy-efficient-edge-fog-cloud-architecture-for-iot-based-59eynsuzfn.pdf`

### Research Problem
Traditional cloud-only agriculture architectures spend too much energy and network capacity moving heterogeneous farm data to distant cloud data centers.

### Core Architecture
The proposed architecture partitions processing across edge, fog, and cloud. Real-time functions such as weather, soil moisture, soil acidity, and irrigation are handled near the farm, while heavier storage and broader analytics remain in the cloud.

### Technologies Used
IoT sensors, edge computing, fog computing, cloud computing, MILP optimization, energy and carbon-emission modeling.

### Key Contributions
- Defines an integrated edge-fog-cloud architecture for smart agriculture.
- Uses mixed-integer linear programming to model energy-efficient placement.
- Shows that processing closer to sensors can reduce cloud load and emissions.

### Methodology
The authors model thousands of sensors and compare the proposed multi-tier architecture against traditional cloud-centric implementation.

### Important Findings
Edge/fog processing improves energy efficiency and makes real-time agriculture services more practical at scale.

### Limitations
MILP models can simplify field realities. Hardware cost, rural maintenance, and smallholder affordability need further deployment validation.

### Relevance to AgroSense
AgroSense can use this as its reference architecture: ESP32 nodes as edge, a phone/Raspberry Pi/Jetson gateway as fog, and Firebase/cloud processing for dashboards and historical analytics.

### Possible Implementation Ideas
- Classify AgroSense workloads as edge-critical, fog-aggregated, or cloud-archival.
- Run irrigation and alert decisions locally when connectivity drops.
- Use cloud only for orthomosaic processing, model management, and long-term analytics.

## Paper 6 - Everything You Wanted to Know About Smart Agriculture

### Basic Metadata
- Authors: Alakananda Mitra, Sukrutha L. T. Vangipuram, Anand K. Bapatla, Venkata K. V. V. Bathalapalli, Saraju P. Mohanty, Elias Kougianos, Chittaranjan Ray
- Publisher: arXiv preprint
- Year: 2022
- DOI / Link: arXiv:2201.04754
- Local PDF: `papers/EVERYTHING_YOU_WANTED_TO_KNOW_ABOUT_SMART_AGRI_45PAGES.pdf`

### Research Problem
The survey organizes the rapidly expanding smart-agriculture field and identifies technologies, architectures, applications, datasets, and open research problems.

### Core Architecture
The paper discusses layered agriculture cyber-physical systems: sensing/device layers, connectivity, edge/cloud processing, analytics, security, and application layers across crop, livestock, UAV, and automation scenarios.

### Technologies Used
IoT, AI, ML, UAVs, wireless sensor networks, edge computing, cloud computing, blockchain/DLT, PUF security, TinyML, Raspberry Pi, ESP8266/ESP32 examples, datasets.

### Key Contributions
- Provides a broad taxonomy of smart agriculture technologies and applications.
- Connects Agriculture 4.0 with IoT, AI/ML, UAVs, robotics, edge/cloud, and security.
- Identifies future research problems across technology and networking.

### Methodology
The authors synthesize prior literature, architectures, datasets, networking options, and challenge areas into a comprehensive survey.

### Important Findings
Smart agriculture is moving toward integrated cyber-physical systems where local sensing, AI, connectivity, and secure data management must be designed together.

### Limitations
As a survey, it provides breadth more than implementable prototypes. Quantitative comparisons across architectures are limited.

### Relevance to AgroSense
This paper gives AgroSense its broad literature map. It validates the combination of UAV photogrammetry, ground sensors, edge AI, ESP32-class embedded devices, cloud dashboards, and future security features.

### Possible Implementation Ideas
- Use the survey taxonomy to organize AgroSense literature review chapters.
- Benchmark AgroSense against Agriculture 4.0 themes: sensing, autonomy, intelligence, connectivity, security, and usability.
- Track future work around low-power TinyML and hardware security for field nodes.

## Paper 7 - A Fog-Based Smart Agriculture System to Detect Animal Intrusion

### Basic Metadata
- Authors: Jinpeng Miao, Dasari Rajasekhar, Shivakant Mishra, Sanjeet Kumar Nayak, Ramanarayan Yadav
- Publisher: Research paper / IEEE-style manuscript
- Year: 2023
- DOI / Link: Not specified in PDF
- Local PDF: `papers/Fog-based Smart Agriculture System to Detect animal anomalies.pdf`

### Research Problem
Rural farmers need timely and affordable animal intrusion detection, but cloud-only systems suffer from latency, bandwidth cost, and disconnections.

### Core Architecture
The system combines PIR sensors, cameras, LoRa communication, and fog computing. Local sensing detects potential intrusion, camera/computer-vision components identify animals, and fog logic predicts future locations before sending alerts.

### Technologies Used
LoRa, PIR sensors, cameras, computer vision, fog computing, low-cost sensor layouts, farmer alerting.

### Key Contributions
- Presents an end-to-end fog-based farm intrusion detection infrastructure.
- Compares sensor layouts for cost and detection coverage.
- Predicts animal future locations to alert farmers before crop damage.

### Methodology
The authors design sensor layouts and a prediction algorithm, then experimentally evaluate detection speed and cost relative to alternatives.

### Important Findings
Fog computing and LoRa can reduce latency and bandwidth dependence while remaining affordable for rural farms.

### Limitations
Animal detection performance depends on sensor placement, camera visibility, lighting, species behavior, and maintenance of distributed devices.

### Relevance to AgroSense
AgroSense can adopt the fog-first alerting pattern for pest/animal/security events. UAV imagery could locate damage zones, while ground PIR/camera nodes provide continuous watch near field boundaries.

### Possible Implementation Ideas
- Add optional LoRa boundary nodes for animal/pest intrusion pilots.
- Run lightweight image classification on a Raspberry Pi or Jetson gateway.
- Route urgent alerts through SMS/WhatsApp when Firebase connectivity is delayed.

## Paper 8 - IoT-Aerial Base Station Task Offloading with Risk-Sensitive Reinforcement Learning for Smart Agriculture

### Basic Metadata
- Authors: Turgay Pamuklu, Anne Catherine Nguyen, Aisha Syed, W. Sean Kennedy, Melike Erol-Kantarci
- Publisher: IEEE Transactions on Green Communications and Networking / arXiv
- Year: 2022
- DOI / Link: 10.1109/TGCN.2022.3205330
- Local PDF: `papers/IoT-Aerial_Base_Station_Task_Offloading_with_RLbased_for_Smartagri.pdf`

### Research Problem
IoT farm devices have limited energy and compute, while aerial base stations also have limited battery. Task offloading must meet deadlines without exhausting aerial resources.

### Core Architecture
IoT nodes offload computational tasks to UAV/aerial base stations. A multi-actor risk-sensitive RL scheduler chooses task assignments while considering deadlines, ABS energy, and hovering time.

### Technologies Used
UAV, aerial base station, IoT task offloading, risk-sensitive reinforcement learning, Q-learning baseline, MILP lower bound.

### Key Contributions
- Models smart-farm computation offloading to aerial base stations.
- Introduces a risk-sensitive multi-actor RL scheduling approach.
- Compares against heuristics, classic Q-learning, and MILP bounds.

### Methodology
The authors formulate deadline-constrained task offloading, build an RL scheduler, and evaluate it through simulation against heuristic and optimization baselines.

### Important Findings
Risk-sensitive scheduling improves guaranteed task service while increasing aerial station hovering time.

### Limitations
The work is simulation-focused and assumes aerial infrastructure that may be expensive for smallholders. It does not implement physical AgroSense-style sensors or dashboards.

### Relevance to AgroSense
AgroSense can use this concept in a lighter way: UAVs or mobile gateways can temporarily act as data mules or compute nodes for fields without connectivity, especially during scouting missions.

### Possible Implementation Ideas
- Treat UAV flights as opportunistic data-collection/offload windows.
- Prioritize urgent field-node uploads using battery and deadline scores.
- Use simpler scheduling heuristics first, then evaluate RL once enough telemetry exists.

## Paper 9 - A LoRa-IoT Framework with Machine Learning for Remote Livestock Monitoring in Smart Agriculture

### Basic Metadata
- Authors: Hitesh Mohapatra
- Publisher: arXiv preprint
- Year: 2025
- DOI / Link: arXiv:2510.07322
- Local PDF: `papers/lora_iot_mlbased_livestock_monitoring_insmartagri2510.07322v1.pdf`

### Research Problem
Remote livestock environments need low-power long-range monitoring without relying on dense cellular or WiFi infrastructure.

### Core Architecture
Wearable sensor collars collect GPS, movement, and temperature. Data moves over LoRa to gateways and then to cloud services for dashboards, alerts, predictive health analytics, and anomaly detection.

### Technologies Used
LoRa, GPS, motion sensors, temperature sensors, cloud analytics, ML-based health alerts, anomaly detection, gateway architecture.

### Key Contributions
- Presents AgroTrack, a low-power LoRa framework for livestock monitoring.
- Adds ML analytics for health and behavior anomalies.
- Reports field trials over a 30-acre area and scalability simulations.

### Methodology
The paper combines field trials with simulation, measuring packet success, range, battery life, scalability, throughput, and gateway-failure recovery.

### Important Findings
LoRa can provide kilometer-scale rural telemetry with high packet success and practical battery life, while ML adds decision-support value.

### Limitations
Livestock tracking differs from crop monitoring; collars require maintenance, and cloud analytics still need reliable gateway backhaul.

### Relevance to AgroSense
AgroSense can reuse the LoRa gateway design for remote plots where WiFi is unrealistic. The field-trial metrics also provide a benchmark for coverage and power planning.

### Possible Implementation Ideas
- Offer LoRa as an optional long-range telemetry mode for ESP32/RS485 sensor clusters.
- Use gateway redundancy for village-scale deployments.
- Adapt anomaly detection to soil moisture, EC, pH, and crop-stress time series.

## Paper 10 - Machine Learning Applications in IoT Based Agriculture and Smart Farming: A Review

### Basic Metadata
- Authors: M. W. P. Maduranga, Ruvan Abeysekera
- Publisher: International Journal of Engineering Applied Sciences and Technology
- Year: 2020
- DOI / Link: Not specified in PDF
- Local PDF: `papers/machine-learning-applications-in-iot-based-agriculture-and-3qim24ivpa.pdf`

### Research Problem
IoT creates large agriculture datasets, but productivity gains require meaningful analysis through machine learning.

### Core Architecture
The review discusses the blend of IoT sensing, data collection, processing, and ML-based decision support across smart farming applications.

### Technologies Used
IoT, ML, smart farming, sensor data, predictive analytics, classification algorithms, farm-management decision support.

### Key Contributions
- Reviews IoT and ML approaches in agriculture.
- Frames MLIoT as a combined paradigm for intelligent farm management.
- Highlights opportunities for applying ML to large sensor datasets.

### Methodology
The authors review existing literature and propose concepts for blending ML and IoT in agriculture.

### Important Findings
ML can improve farm productivity when sensor data is cleaned, contextualized, and transformed into prediction or recommendation workflows.

### Limitations
The review is high-level and provides limited implementation detail, benchmarking, or hardware guidance.

### Relevance to AgroSense
This supports AgroSense's Random Forest NPK estimation direction and broader sensor-fusion analytics. It reinforces that AgroSense must treat data quality and model selection as core system features.

### Possible Implementation Ideas
- Build a repeatable ML pipeline for soil, crop-stress, and weather variables.
- Start with interpretable models for farmer trust and debugging.
- Create datasets from every pilot for future model retraining.

## Paper 11 - Online Processing of Vehicular Data on the Edge Through an Unsupervised TinyML Regression Technique

### Basic Metadata
- Authors: Pedro Andrade, Ivanovitch Silva, Marianne Diniz, Thommas Flores, Daniel G. Costa, Eduardo Soares
- Publisher: ACM Transactions / ACM manuscript
- Year: 2023
- DOI / Link: 10.1145/3591356
- Local PDF: `papers/online-processing-of-vehicular-data-on-the-edge-through-an-unsupervised-model.pdf`

### Research Problem
Streaming IoT data must be processed on constrained devices, but supervised models can be too heavy or require labeled datasets.

### Core Architecture
The algorithm runs at the edge, processes incoming streams online, identifies patterns using typicality and eccentricity, and predicts values using a Recursive Least Squares component.

### Technologies Used
TinyML, unsupervised learning, regression, RLS filter, edge stream processing, microcontrollers, vehicular datasets.

### Key Contributions
- Introduces an unsupervised TinyML regression technique for edge streams.
- Avoids reliance on labeled training data.
- Reports lower error than RLS and CNN baselines in vehicular experiments.

### Methodology
The authors run extensive experiments on vehicular data streams and compare against RLS and CNN approaches using mean squared error.

### Important Findings
Online unsupervised edge learning can outperform heavier methods for certain streaming regression tasks while remaining suitable for constrained devices.

### Limitations
The domain is vehicular rather than agriculture; transfer to soil or crop-stress data requires validation. Unsupervised models still need drift monitoring.

### Relevance to AgroSense
AgroSense can adapt this class of TinyML technique for on-device soil-moisture trend prediction, anomaly detection, or sensor fault detection on ESP32-class devices.

### Possible Implementation Ideas
- Test TinyML regression for soil-moisture and EC forecasting on ESP32.
- Use unsupervised residuals to detect sensor faults or irrigation leaks.
- Compare against the current Random Forest pipeline for edge feasibility.

## Paper 12 - An Ontological Knowledge Representation for Smart Agriculture

### Basic Metadata
- Authors: Bikram Pratim Bhuyan, Ravi Tomar, Maanak Gupta, Amar Ramdane-Cherif
- Publisher: IEEE-style conference paper
- Year: 2022
- DOI / Link: Not specified in PDF
- Local PDF: `papers/ontological_knldg_Representation_For smartagri.pdf`

### Research Problem
Smart agriculture systems collect heterogeneous sensor and contextual data, but decision-making requires structured knowledge representation.

### Core Architecture
The paper proposes an agricultural ontology and represents the knowledge graph as a lattice for spatio-temporal agricultural data reasoning.

### Technologies Used
Ontology, knowledge graph, lattice structure, IoT, WSN, spatio-temporal data, smart farming semantics.

### Key Contributions
- Defines an ontology-oriented smart agriculture knowledge model.
- Uses lattice representation to support reasoning over agricultural data.
- Connects IoT data collection with higher-level semantic decision support.

### Methodology
The authors formulate an ontology framework and discuss how extracted farm knowledge can be represented and reasoned over.

### Important Findings
Semantic structure is valuable when raw sensor data must be transformed into explainable recommendations.

### Limitations
The work is conceptual and does not provide a full low-cost deployment, edge implementation, or farmer-facing interface.

### Relevance to AgroSense
AgroSense can use an ontology-lite design for its dashboard: field, plot, crop, sensor, UAV image, soil sample, NPK estimate, recommendation, and farmer action should be linked explicitly.

### Possible Implementation Ideas
- Create a simple AgroSense data model that connects sensor readings to zones and recommendations.
- Use semantic labels to explain alerts in the dashboard and chatbot.
- Store provenance: which UAV flight, soil probe, and model produced each recommendation.

## Paper 13 - Reliable and Cost-Efficient IoT Connectivity for Smart Agriculture: A Comparative Study of LPWAN, 5G, and Hybrid Connectivity Models

### Basic Metadata
- Authors: Mohamed Shabeer Mohamed Rafi, Mehran Behjati, Ahmad Sahban Rafsanjani
- Publisher: Research paper / review manuscript
- Year: 2025
- DOI / Link: Not specified in PDF
- Local PDF: `papers/Reliable and Cost-Efficient IoT Connectivity for Smart agri LWPAN 5G.pdf`

### Research Problem
Agriculture deployments need reliable connectivity across diverse terrain, but no single network technology balances cost, range, bandwidth, and latency for all use cases.

### Core Architecture
The paper compares LPWAN technologies such as LoRaWAN, NB-IoT, and Sigfox with 4G/5G, then recommends hybrid LPWAN-5G models where low-power sensors use LPWAN and gateways or high-bandwidth devices use cellular links.

### Technologies Used
LoRaWAN, NB-IoT, Sigfox, 4G/5G, hybrid networking, IoT gateways, smart-farm case studies.

### Key Contributions
- Compares LPWAN and cellular options for farm connectivity.
- Evaluates hybrid LPWAN-5G models for cost and reliability.
- Provides recommendations for network selection by agriculture requirement.

### Methodology
The study synthesizes 2020-2024 literature and case studies, emphasizing cost, reliability, and deployment suitability.

### Important Findings
Hybrid LPWAN-5G models can reduce connectivity cost while improving reliability in remote agricultural settings.

### Limitations
5G availability in Indian villages is uneven, NB-IoT/Sigfox ecosystem support varies, and business-model costs can dominate technical suitability.

### Relevance to AgroSense
This is central to AgroSense scaling. Smallholder deployments should not assume continuous WiFi. ESP32 nodes can use WiFi in greenhouse/lab pilots, LoRa in open fields, and cellular/5G only at gateways or UAV upload points.

### Possible Implementation Ideas
- Design AgroSense communications as pluggable: WiFi, LoRa, cellular gateway.
- Use LoRa for low-rate soil telemetry and WiFi/cellular for UAV imagery upload.
- Add a connectivity decision matrix to deployment planning.

## Paper 14 - Simulating Battery-Powered TinyML Systems Optimised using Reinforcement Learning in Image-Based Anomaly Detection

### Basic Metadata
- Authors: Jared M. Ping, Ken J. Nixon
- Publisher: TinyML / research preprint
- Year: 2024
- DOI / Link: Not specified in PDF
- Local PDF: `papers/RL_in_image_based_anomaly_Detection.pdf`

### Research Problem
Battery-powered TinyML systems must balance inference, on-device training, cloud offload, and communication to maximize lifetime.

### Core Architecture
A simulated battery-powered IoT image-anomaly system uses RL to choose operational modes, including cloud anomaly processing and on-device training, compared against static and dynamic optimization policies.

### Technologies Used
TinyML, reinforcement learning, image anomaly detection, battery simulation, cloud processing, on-device training, low-memory model.

### Key Contributions
- Optimizes TinyML system operations with RL for battery life.
- Benchmarks RL against static and dynamic policies.
- Shows a low-memory approach suitable for constrained hardware.

### Methodology
The authors run modeled simulations and compare battery life effects across control policies.

### Important Findings
RL improves battery life by 22.86% over static and 10.86% over dynamic optimization in the reported setup.

### Limitations
The study is simulation-first and needs hardware benchmarking. Image-based field deployments must handle lighting, dust, weather, and model drift.

### Relevance to AgroSense
AgroSense can use RL-style or simpler adaptive policies for when ESP32/edge cameras should sample, infer, train, transmit, or sleep. This is especially relevant for solar/battery sensor nodes.

### Possible Implementation Ideas
- Start with rule-based adaptive duty cycling, then test RL once pilot telemetry exists.
- Schedule UAV/image uploads based on battery, confidence, and connectivity.
- Use TinyML anomaly detection for crop-stress snapshots at boundary nodes.

## Paper 15 - Smart Agriculture Architecture and Current State in India

### Basic Metadata
- Authors: Parul Verma
- Publisher: International Journal of Technology, Management & Knowledge Processing
- Year: 2021
- DOI / Link: Not specified in PDF
- Local PDF: `papers/Smart Agriculture Architecture and Current developement in INDIA.pdf`

### Research Problem
Indian agriculture needs precision-farming approaches to manage weather, soil, fertilizer, pest control, cattle, and resource efficiency.

### Core Architecture
The paper outlines a smart agriculture framework based on IoT devices, sensors, wireless technologies, data collection, and analytics for precision farming.

### Technologies Used
IoT, smart sensors, wireless technologies, precision farming, Indian agriculture use cases, analytics.

### Key Contributions
- Frames the role of IoT in Indian smart agriculture.
- Discusses smart agriculture architecture and data analytics.
- Highlights India-specific need for technology integration in farming.

### Methodology
The work is a conceptual/review paper describing architecture and current state rather than a field prototype.

### Important Findings
India's agriculture sector can benefit from sensor-driven precision farming, but practical adoption depends on cost, usability, and local context.

### Limitations
The paper has limited quantitative evaluation, limited hardware specifics, and limited edge/cloud optimization detail.

### Relevance to AgroSense
This paper anchors AgroSense's startup context: Indian farmers need affordable, usable, locally maintainable tools. It supports focusing on low-cost ESP32 nodes, human-guided workflows, and practical dashboards rather than over-automated expensive systems.

### Possible Implementation Ideas
- Prioritize Indian smallholder constraints in every feature: price, repairability, language, and intermittent connectivity.
- Design pilot studies around crop-specific local workflows.
- Use analytics that produce simple recommendations, not only charts.

## Paper 16 - Smart Agriculture: Implementing IoT for Greenhouse Monitoring

### Basic Metadata
- Authors: Sergio Apolinario da Costa
- Publisher: Turku University of Applied Sciences bachelor thesis
- Year: 2024
- DOI / Link: Not applicable
- Local PDF: `papers/Smart Agriculture_Implementing-AWSIoTandalot.pdf`

### Research Problem
Greenhouse farmers need reliable environmental monitoring to optimize resource use and plant growth.

### Core Architecture
ESP32 devices collect environmental data and send it through MQTT/WiFi to a central program/cloud stack. Data is organized and stored in a database and visualized through a dashboard.

### Technologies Used
ESP32, MQTT, AWS, BME680, BH1750, MongoDB, Angular, greenhouse sensors, database-backed dashboard.

### Key Contributions
- Implements a complete greenhouse IoT monitoring prototype.
- Uses ESP32 and common sensors in a maintainable architecture.
- Reports a 45-day greenhouse test with reliable operation.

### Methodology
The thesis designs, implements, and tests the system over 45 days in a greenhouse, assessing data continuity and operational reliability.

### Important Findings
A modest ESP32-based system can monitor greenhouse conditions reliably for extended periods without maintenance.

### Limitations
The system targets greenhouse conditions, not open-field ruggedness. It is monitoring-oriented and lacks integrated agronomic ML or UAV fusion.

### Relevance to AgroSense
This is highly practical for AgroSense's embedded and dashboard stack. It validates ESP32, MQTT-style telemetry, and real deployment testing. AgroSense can swap AWS/MongoDB for Firebase/ThingSpeak where appropriate.

### Possible Implementation Ideas
- Adopt MQTT for more scalable telemetry than direct REST writes when node count grows.
- Use a 30-45 day reliability test as a minimum field-pilot benchmark.
- Mirror the dashboard architecture for greenhouse or nursery AgroSense pilots.

## Paper 17 - Survey of Intelligent Agricultural IoT Based on 5G

### Basic Metadata
- Authors: Jun Liu, Lei Shu, Xu Lu, Ye Liu
- Publisher: Electronics, MDPI
- Year: 2023
- DOI / Link: 10.3390/electronics12102336
- Local PDF: `papers/Survey of Intelligent Agricultural IoT Based on 5G.pdf`

### Research Problem
Agriculture requires higher production, sustainability, intelligence, and efficiency; 5G changes what is possible for sensing, control, and autonomous machinery.

### Core Architecture
The survey describes 5G agricultural IoT as a cloud-edge-end system combining terminal sensing, communication, edge computing, cloud services, AI, UAVs, and intelligent machinery.

### Technologies Used
5G, IoT, edge computing, cloud services, AI, big data, UAVs, intelligent machinery, massive sensing, lightweight deep learning, network slicing concepts.

### Key Contributions
- Summarizes the architecture and enabling technologies of 5G agricultural IoT.
- Reviews application scenarios across farms, forestry, animal husbandry, and fishing.
- Identifies key scientific problems and future development directions.

### Methodology
The authors review recent 5G-IoT smart agriculture research, architectures, technologies, cases, and challenges.

### Important Findings
5G strengthens real-time monitoring, UAV operations, machine autonomy, and cloud-edge collaboration, but also raises cost, coverage, and system-complexity questions.

### Limitations
The 5G vision can exceed the budget and coverage realities of Indian smallholders. The survey is broad and not a low-cost deployment guide.

### Relevance to AgroSense
AgroSense should be 5G-ready without being 5G-dependent. Its architecture can follow cloud-edge-end principles while relying on WiFi/LoRa/local gateways in early low-cost pilots.

### Possible Implementation Ideas
- Define AgroSense as cloud-edge-end from the start.
- Use 5G/cellular only where it improves UAV upload or gateway backhaul.
- Prepare for future autonomous machinery integration through standardized APIs.

# 4. Thematic Grouping

## Edge AI Systems
Edge AI appears in the predictive data-reduction paper, the TinyML regression paper, the RL TinyML anomaly-detection work, and the fog-based animal intrusion system. The shared trend is that raw farm data should not always be sent to the cloud. Local inference, residual detection, duty-cycle control, and selective transmission reduce bandwidth and power use. The tradeoff is that edge logic must be simple enough for constrained hardware and carefully monitored so that rare but important agronomic events are not suppressed.

## Cloud Agriculture Platforms
ThingSpeak, AWS IoT, Firebase-like dashboards, Android apps, LINE chatbots, and cloud analytics recur across the corpus. Cloud platforms are strongest for visualization, storage, remote access, model management, and long-term analytics. Their weakness is dependence on connectivity and recurring cost. AgroSense should keep the cloud as the coordination and insight layer, not the only place where urgent farm logic can run.

## UAV-Based Monitoring
The UAV irrigation paper, aerial base station task-offloading work, 5G survey, and broad smart-agriculture survey show two UAV roles: sensing platforms and temporary communication/compute infrastructure. UAVs are powerful for spatial coverage but constrained by battery, flight planning, regulations, weather, and image-processing cost. For AgroSense, UAV flights should be tied to field tasks: stress mapping, waypoint-guided soil sampling, and validation of ground sensor anomalies.

## Sensor Fusion Systems
The corpus repeatedly combines soil moisture, temperature, humidity, pH/acidity, light, GPS, image, PIR, and livestock motion data. Fusion is useful only if each reading has location, time, calibration status, and provenance. AgroSense should fuse UAV RGB stress, GPS-tagged soil samples, RS485 Modbus readings, and weather context into zone-level recommendations rather than treating every sensor stream separately.

## TinyML / Embedded ML
TinyML papers show that edge inference and even lightweight online learning are possible, but battery management and model drift become first-class design concerns. TinyML is most appropriate for anomaly detection, trend prediction, sensor fault detection, and local classification when cloud access is weak. AgroSense can begin with Random Forest inference at a gateway and progressively push smaller models onto ESP32-class hardware.

## IoT Telemetry Systems
Telemetry examples range from WiFi/ThingSpeak and ESP32/MQTT/AWS to LoRa livestock collars and LPWAN/5G hybrids. The engineering pattern is clear: high-volume data such as UAV imagery should use WiFi/cellular upload at gateways, while low-rate soil telemetry can use WiFi, LoRa, or store-and-forward depending on the field.

## Precision Agriculture Frameworks
Survey and India-focused papers emphasize that precision agriculture is socio-technical: sensing and AI must fit farmer budgets, local crops, repair constraints, language, connectivity, and trust. AgroSense's strongest product direction is not maximum automation; it is affordable guidance that fits real smallholder workflows.

## Distributed Edge Architectures
Edge-fog-cloud and fog-intrusion papers argue for multi-tier computation. Edge nodes sense and pre-filter, fog/gateway nodes aggregate and infer, and cloud services store, visualize, and coordinate. This is the most suitable architecture family for AgroSense.

## Real-Time Monitoring Systems
Greenhouse monitoring, intrusion detection, irrigation, and livestock tracking require timely alerts. The tradeoff is between latency and cost: local alerts are fastest, cloud dashboards are easiest to maintain, and hybrid paths give resilience.

## Smart Irrigation / Fertigation
The UAV irrigation and sensor-monitoring papers support irrigation decisions from moisture, temperature, humidity, and aerial observations. AgroSense can extend this to fertigation by adding NPK estimation, soil EC/pH, crop stress, and zone prescriptions.

## Autonomous Navigation
The aerial base station and UAV survey material point toward autonomous or semi-autonomous navigation. For AgroSense's current stage, human-guided waypoint navigation is the right intermediate step because it reduces cost and operational risk while still producing GPS-aligned data.

# 5. Comparative Analysis

## Architecture Comparison

| Paper | Architecture Type | Edge Device | Cloud Platform | ML Type | Real-time Support |
| --- | --- | --- | --- | --- | --- |
| A Feasible IoT-Based System for Precision Agriculture | Hybrid | self-powered field station, remote collector | ThingSpeak / web IoT server | none; monitoring and control logic | near-real-time telemetry |
| A Pilot Study of Smart Agricultural Irrigation using Unmanned Aerial Vehicles and IoT-Based Cloud System | Hybrid | Arduino microcontroller boards, WiFi modules, UAV payload | IoT-based cloud and Android application | rule-based irrigation computation | remote monitoring and control |
| Chatbot Application to Support Smart Agriculture in Thailand | Cloud | farmer smartphone and existing smart agriculture sensors | LINE chatbot / knowledge service | knowledge representation and recommendation logic | real-time conversational support |
| Edge-Based Predictive Data Reduction for Smart Agriculture: A Lightweight Approach to Efficient IoT Communication | Hybrid | edge gateway / constrained IoT node | cloud mirror model for consistency | lightweight analytical prediction and cross-site generalization | yes, selective transmission |
| Energy-Efficient Edge-Fog-Cloud Architecture for IoT-Based Smart Agriculture Environment | Hybrid | edge/fog nodes for local processing | central cloud data center | optimization model; AI-enabled architecture context | yes at edge/fog layers |
| Everything You Wanted to Know About Smart Agriculture | Hybrid | survey covers sensors, edge devices, Raspberry Pi, ESP32-class boards | cloud, edge, and blockchain-enabled frameworks | AI/ML survey including crop, soil, UAV, and security use cases | varies by application |
| A Fog-Based Smart Agriculture System to Detect Animal Intrusion | Hybrid | PIR sensors, cameras, local/fog computing nodes | limited; fog-first design | computer vision and prediction algorithm | yes, intrusion alerts |
| IoT-Aerial Base Station Task Offloading with Risk-Sensitive Reinforcement Learning for Smart Agriculture | Edge | IoT devices and aerial base stations | not central; aerial edge offloading | multi-actor risk-sensitive reinforcement learning | deadline-constrained task processing |
| A LoRa-IoT Framework with Machine Learning for Remote Livestock Monitoring in Smart Agriculture | Hybrid | wearable collars with GPS, motion, and temperature sensors | cloud visualization, alerts, and analytics | predictive health alerts and behavioral anomaly detection | yes, tracking and alerts |
| Machine Learning Applications in IoT Based Agriculture and Smart Farming: A Review | Hybrid | IoT sensor nodes, embedded boards in reviewed systems | cloud and data analytics systems in reviewed literature | MLIoT, SVM, classification, prediction, decision support | varies by application |
| Online Processing of Vehicular Data on the Edge Through an Unsupervised TinyML Regression Technique | Edge | microcontrollers and edge devices | not central | unsupervised TinyML regression with typicality, eccentricity, and RLS | yes, online stream processing |
| An Ontological Knowledge Representation for Smart Agriculture | Cloud | not central; IoT/WSN data sources | knowledge graph / semantic reasoning layer | semantic reasoning; possible integration with ML | decision-support oriented |
| Reliable and Cost-Efficient IoT Connectivity for Smart Agriculture: A Comparative Study of LPWAN, 5G, and Hybrid Connectivity Models | Hybrid | field IoT nodes and gateways | cloud backhaul through gateway/cellular networks | not central | depends on connectivity tier |
| Simulating Battery-Powered TinyML Systems Optimised using Reinforcement Learning in Image-Based Anomaly Detection | Hybrid | battery-powered TinyML image device | cloud anomaly processing when needed | reinforcement learning, image anomaly detection, on-device training/inference | event-driven |
| Smart Agriculture Architecture and Current State in India | Hybrid | smart sensors and wireless devices | analytics and smart agriculture framework | data analytics for precision farming | monitoring-oriented |
| Smart Agriculture: Implementing IoT for Greenhouse Monitoring | Hybrid | ESP32 devices with BME680 and BH1750 sensors | AWS IoT, database/backend, dashboard | monitoring; no major ML focus | yes, greenhouse telemetry |
| Survey of Intelligent Agricultural IoT Based on 5G | Hybrid | massive sensor nodes, terminal devices, edge nodes | 5G cloud-edge-end architecture | AI, big data, lightweight deep learning, UAV and machinery intelligence | yes for 5G-enabled scenarios |

## Communication Stack Comparison

| Paper | MQTT | HTTP | LoRa | WiFi | Cellular | BLE |
| --- | --- | --- | --- | --- | --- | --- |
| A Feasible IoT-Based System for Precision Agriculture | No | Yes | Referenced | Yes | Optional | No |
| A Pilot Study of Smart Agricultural Irrigation using Unmanned Aerial Vehicles and IoT-Based Cloud System | No | Likely | No | Yes | Mobile app | No |
| Chatbot Application to Support Smart Agriculture in Thailand | No | Yes | No | Yes | Yes | No |
| Edge-Based Predictive Data Reduction for Smart Agriculture: A Lightweight Approach to Efficient IoT Communication | Referenced | Referenced | Referenced | Referenced | Referenced | Referenced |
| Energy-Efficient Edge-Fog-Cloud Architecture for IoT-Based Smart Agriculture Environment | Not central | Not central | Referenced | Not central | Referenced | No |
| Everything You Wanted to Know About Smart Agriculture | Referenced | Referenced | Referenced | Referenced | Referenced | Referenced |
| A Fog-Based Smart Agriculture System to Detect Animal Intrusion | Not central | Not central | Yes | Local | Optional | No |
| IoT-Aerial Base Station Task Offloading with Risk-Sensitive Reinforcement Learning for Smart Agriculture | No | No | Referenced | No | 5G context | No |
| A LoRa-IoT Framework with Machine Learning for Remote Livestock Monitoring in Smart Agriculture | Likely | Likely | Yes | Gateway-side | Gateway-side | No |
| Machine Learning Applications in IoT Based Agriculture and Smart Farming: A Review | Referenced | Referenced | Referenced | Referenced | Referenced | No |
| Online Processing of Vehicular Data on the Edge Through an Unsupervised TinyML Regression Technique | No | No | Referenced | No | No | No |
| An Ontological Knowledge Representation for Smart Agriculture | No | No | No | No | No | No |
| Reliable and Cost-Efficient IoT Connectivity for Smart Agriculture: A Comparative Study of LPWAN, 5G, and Hybrid Connectivity Models | Referenced | Referenced | Yes | Referenced | Yes | No |
| Simulating Battery-Powered TinyML Systems Optimised using Reinforcement Learning in Image-Based Anomaly Detection | No | No | Referenced | No | Referenced | No |
| Smart Agriculture Architecture and Current State in India | Referenced | Referenced | Referenced | Referenced | Referenced | No |
| Smart Agriculture: Implementing IoT for Greenhouse Monitoring | Yes | Yes | No | Yes | No | Referenced |
| Survey of Intelligent Agricultural IoT Based on 5G | Referenced | Referenced | Referenced | Referenced | Yes | No |

## AI Deployment Comparison

| Paper | Cloud AI | Edge AI | Hybrid AI | TinyML | On-device inference |
| --- | --- | --- | --- | --- | --- |
| A Feasible IoT-Based System for Precision Agriculture | No | No | No | No | No |
| A Pilot Study of Smart Agricultural Irrigation using Unmanned Aerial Vehicles and IoT-Based Cloud System | Partial | No | No | No | No |
| Chatbot Application to Support Smart Agriculture in Thailand | Partial | No | No | No | No |
| Edge-Based Predictive Data Reduction for Smart Agriculture: A Lightweight Approach to Efficient IoT Communication | Partial | Yes | Yes | Referenced | Yes |
| Energy-Efficient Edge-Fog-Cloud Architecture for IoT-Based Smart Agriculture Environment | Yes | Yes | Yes | No | Partial |
| Everything You Wanted to Know About Smart Agriculture | Yes | Yes | Yes | Referenced | Referenced |
| A Fog-Based Smart Agriculture System to Detect Animal Intrusion | No | Yes | Partial | No | Yes |
| IoT-Aerial Base Station Task Offloading with Risk-Sensitive Reinforcement Learning for Smart Agriculture | No | Yes | No | No | No |
| A LoRa-IoT Framework with Machine Learning for Remote Livestock Monitoring in Smart Agriculture | Yes | Partial | Yes | No | Partial |
| Machine Learning Applications in IoT Based Agriculture and Smart Farming: A Review | Yes | Partial | Yes | No | Partial |
| Online Processing of Vehicular Data on the Edge Through an Unsupervised TinyML Regression Technique | No | Yes | No | Yes | Yes |
| An Ontological Knowledge Representation for Smart Agriculture | Partial | No | No | No | No |
| Reliable and Cost-Efficient IoT Connectivity for Smart Agriculture: A Comparative Study of LPWAN, 5G, and Hybrid Connectivity Models | No | No | No | No | No |
| Simulating Battery-Powered TinyML Systems Optimised using Reinforcement Learning in Image-Based Anomaly Detection | Yes | Yes | Yes | Yes | Yes |
| Smart Agriculture Architecture and Current State in India | Partial | Partial | Partial | No | No |
| Smart Agriculture: Implementing IoT for Greenhouse Monitoring | No | No | No | No | No |
| Survey of Intelligent Agricultural IoT Based on 5G | Yes | Yes | Yes | Referenced | Partial |

# 6. Research Gaps

- Affordability remains underdeveloped. Many architectures assume cloud, 5G, UAV infrastructure, or multiple gateways without showing a smallholder cost model.
- Intermittent connectivity is recognized but rarely solved end to end. More work is needed on local buffering, sync conflict handling, offline dashboards, and delayed UAV/image uploads.
- Low-power design is often discussed separately from AI accuracy. AgroSense needs joint evaluation of battery life, sampling rate, model confidence, and transmission frequency.
- Real-world Indian deployment evidence is thin. Field trials should include heat, dust, monsoon humidity, patchy mobile coverage, farmer training, sensor calibration, and repair workflows.
- Edge-cloud collaboration lacks standard decision rules. Papers argue that some work should move to edge/fog, but few give practical workload partitioning templates for low-cost farms.
- Explainability is weak. Farmers need to know why a zone is marked stressed or why irrigation/fertilizer is recommended.
- Sensor fusion is often named but not operationalized. UAV imagery, soil probes, GPS sampling, and weather data need a shared spatial data model.
- Cloud cost and write-volume management are underexplored. Predictive data reduction and event-based upload should be part of the architecture from the beginning.
- Model transfer across farms is unresolved. Soil type, crop variety, irrigation method, and sensor calibration can break models trained elsewhere.
- Maintenance and calibration are rarely central. Smallholder products need calibration reminders, rugged connectors, replaceable probes, and clear fault detection.

# 7. Opportunities for AgroSense

- Build a cloud-edge-end product instead of a dashboard-only system: ESP32 nodes for acquisition, gateway/fog for aggregation and inference, cloud for maps, history, and collaboration.
- Use predictive data reduction to lower Firebase writes and power use while preserving agronomic events.
- Offer multiple connectivity profiles: WiFi greenhouse mode, LoRa open-field mode, and cellular gateway mode.
- Fuse UAV RGB stress maps with GPS-tagged soil readings to recommend sampling points and interventions.
- Make farmer usability a differentiator through local-language alerts, conversational explanations, and simple zone priorities.
- Treat every pilot as dataset generation. Store raw readings, calibration metadata, UAV flight metadata, recommendations, and farmer actions.
- Add edge reliability features: offline queue, sensor fault detection, clock sync, and gateway health reporting.
- Build a modular architecture where Firebase/ThingSpeak/AWS can be swapped depending on client budget and deployment scale.
- Use interpretable ML first: Random Forest, regression, threshold rules, residual models, and feature importance before heavier deep learning.
- Differentiate with low-cost implementation evidence in Indian field conditions, not just algorithmic novelty.

# 8. Suggested Final Architecture

## Edge Layer
ESP32 nodes collect soil moisture, temperature, pH, EC, NPK-related probe values, light, and local weather data. Nodes perform calibration checks, timestamping, local validation, and predictive/delta filtering. They should buffer readings during network loss and expose a simple health status.

## Sensor Layer
RS485 Modbus soil probes provide structured soil measurements. Optional PIR/camera boundary nodes can support animal or pest intrusion pilots. Every sensor reading should carry field ID, plot/zone ID, GPS coordinate or mapped location, device ID, calibration version, and battery/voltage status.

## Telemetry Layer
Use WiFi/MQTT for greenhouse and nearby gateway deployments, LoRa for long-range low-rate telemetry, and cellular/5G only at gateways or UAV upload stations. MQTT should become the scalable default as node count grows, with Firebase/ThingSpeak adapters downstream.

## Fog / Gateway Layer
A phone, Raspberry Pi, or Jetson-class gateway aggregates ESP32 data, runs heavier validation, synchronizes offline queues, and executes Random Forest or lightweight anomaly models. The gateway should also translate local protocols into cloud APIs and provide local alerts when the Internet is down.

## UAV Layer
UAV flights capture RGB imagery for crop-stress analysis and map generation. Cloud orthomosaic processing can remain centralized initially, while mission metadata and stress zones are linked to ground readings. UAV outputs should generate sampling waypoints rather than standalone images.

## AI Layer
Use a tiered AI strategy: thresholds and predictive filters on ESP32, Random Forest and anomaly detection on the gateway, and retraining/orthomosaic analytics in the cloud. TinyML should be introduced for specific high-value tasks such as sensor-fault detection or crop-stress snapshot classification.

## Cloud Layer
Firebase or an equivalent cloud backend stores telemetry, users, fields, zones, alerts, model outputs, and dashboard state. Heavy image processing, historical analytics, model training, and cross-farm benchmarking stay in the cloud. ThingSpeak can remain useful for quick public/engineering visualizations.

## Dashboard Layer
The dashboard should show field maps, stress zones, soil trends, sensor health, sampling waypoints, NPK estimates, and recommended actions. It should prioritize clarity: traffic-light zone status, confidence levels, and reason codes for every recommendation.

## Future Scalability Layer
Add pluggable connectivity, multi-farm tenancy, role-based access, data export, model-version tracking, local-language advisory messages, and optional chatbot support. For larger deployments, introduce queue-based ingestion, MQTT brokers, geospatial indexing, and gateway fleet management.

# 9. Final Conclusion

The PDF corpus strongly supports AgroSense's direction toward a low-cost cloud-edge precision agriculture system. The most relevant papers converge on a practical architecture: constrained field devices should sense, validate, and reduce data locally; gateways should aggregate, infer, and survive intermittent connectivity; cloud systems should visualize, store, coordinate, and train models; UAVs should provide spatial context that guides ground sampling and intervention.

The strongest research directions for AgroSense are hybrid cloud-edge design, UAV and ground-sensor fusion, low-power telemetry, predictive data reduction, and farmer-facing decision support. The literature also warns against overbuilding around expensive assumptions such as always-on 5G, cloud-only analytics, or fully autonomous UAV workflows before the field economics are proven.

Implementation priority should therefore be: reliable ESP32/RS485 telemetry, gateway buffering and inference, UAV stress-zone mapping, Firebase/ThingSpeak dashboard integration, GPS-guided soil sampling, interpretable Random Forest NPK estimation, and local-language recommendations. If AgroSense can demonstrate these pieces in Indian smallholder conditions with clear cost and usability evidence, it will stand ahead of many research prototypes that remain either too conceptual, too cloud-dependent, or too expensive for real farms.

## Extraction Note

The analysis was generated after extracting text and metadata from all 17 PDFs in `papers/`. Intermediate extraction files are stored in `pdf_extracts/`, and the extraction helper is `extract_pdf_corpus.py`.
