# Linguistic 3D Dynamic System

## Overview

Questo progetto implementa un sistema dinamico che modella il linguaggio come una rete evolutiva tridimensionale.

Il sistema integra:

- streaming di dati linguistici
- embedding semantico dinamico
- simulazione fisica (force-directed)
- struttura emergente (hub, cluster)
- base per anomaly detection e analisi temporale

---

# 1. Modello generale

Il sistema è definito da un loop dinamico:

\[
C(t) \rightarrow E(t) \rightarrow W(t) \rightarrow X(t)
\]

dove:

- \( C(t) \): corpus (input testuale)
- \( E(t) \): embedding semantici
- \( W(t) \): matrice di connessione
- \( X(t) \): posizione 3D dei nodi

---

# 2. Corpus e co-occorrenze

Dato un documento:

\[
d = \{t_1, t_2, ..., t_n\}
\]

frequenza token:

\[
f_i(t) = f_i(t-1) + 1
\]

co-occorrenza:

\[
cooc_{ij}(t) = cooc_{ij}(t-1) + 1
\]

con decay:

\[
f_i(t) \leftarrow \alpha f_i(t)
\]

---

# 3. Embedding semantico

Ogni nodo ha embedding:

\[
\mathbf{e}_i \in \mathbb{R}^d
\]

aggiornato tramite:

\[
\mathbf{e}_i(t+1) =
(1 - \eta)\mathbf{e}_i(t)
+ \eta \cdot \frac{1}{|N(i)|} \sum_{j \in N(i)} \mathbf{e}_j(t)
\]

dove:

- \( \eta \): learning rate
- \( N(i) \): vicini nel grafo

---

# 4. Similarità

\[
S_{ij} = \cos(\mathbf{e}_i, \mathbf{e}_j)
\]

---

# 5. Costruzione del grafo

Un edge esiste se:

\[
S_{ij} > \tau
\]

---

# 6. Dinamica fisica

Ogni nodo ha:

- posizione \( \mathbf{x}_i \)
- velocità \( \mathbf{v}_i \)

---

## 6.1 Forza di repulsione

\[
\mathbf{F}_{ij}^{rep} =
\frac{k_r}{\|\mathbf{x}_i - \mathbf{x}_j\|^2}
\]

---

## 6.2 Forza elastica

\[
\mathbf{F}_{ij}^{spring} =
k_s (\|\mathbf{x}_j - \mathbf{x}_i\| - l)
\]

---

## 6.3 Equazione del moto

\[
\mathbf{v}_i(t+1) =
\gamma \mathbf{v}_i(t) + \frac{1}{m_i}\sum \mathbf{F}_i
\]

\[
\mathbf{x}_i(t+1) =
\mathbf{x}_i(t) + \mathbf{v}_i(t+1)
\]

---

# 7. Proprietà emergenti

Il sistema mostra:

- clustering semantico
- formazione di hub
- evoluzione temporale
- adattamento al corpus

---

# 8. Architettura

## Data Layer
- tokenizzazione
- streaming
- co-occorrenze

## Semantic Layer
- embedding dinamico
- similarità

## Graph Layer
- nodi e archi dinamici

## Physics Layer
- simulazione 3D

## Visualization
- rendering Three.js

---

# 9. Limitazioni attuali

- embedding semplificato (non transformer completo)
- edge threshold statico
- assenza anomaly detection

---

# 10. Evoluzioni previste

- transformer locale
- anomaly detection
- temporal clustering
- insight analytics
- GPU acceleration

---

# 11. Interpretazione

Il sistema modella il linguaggio come:

> un sistema dinamico auto-organizzante basato su interazioni locali e adattamento continuo

---

# 12. Conclusione

Questo progetto rappresenta un framework per studiare:

- evoluzione linguistica
- strutture semantiche emergenti
- sistemi complessi adattivi
