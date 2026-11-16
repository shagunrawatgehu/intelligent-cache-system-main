# Standardized Cache Memory Overhead Specification

This document details the exact mathematical formulas and theoretical operating system justifications for measuring **Memory Overhead** across all cache replacement algorithms in the project.

---

## 🚫 What is NOT Counted as Algorithm Overhead
The physical cache frames storing the requested page numbers themselves ($M \times 4\text{ Bytes}$) are **part of the baseline hardware memory**, regardless of which algorithm runs. Therefore, **they are not counted as algorithm overhead**.

Only the **additional control metadata structures** required by an algorithm to make eviction decisions are counted.

---

## 📊 Summary Comparison Table

| Algorithm | Control Metadata Tracked | Exact Formula (Bytes) | Example ($M=3, N=20, U=5, E=6$) |
|---|---|---|---|
| **FIFO** | Queue head (4B), tail (4B), queue ordering index table ($M \times 4\text{B}$) | $M \times 4 + 8$ | **20 Bytes** |
| **LRU** | Doubly linked list tracking: `prev` (4B) and `next` (4B) pointer per frame | $M \times 8$ | **24 Bytes** |
| **LFU** | Frequency counter (4B) + arrival timestamp (4B) per frame | $M \times 8$ | **24 Bytes** |
| **Belady OPT** | Next occurrence distance array ($M \times 4\text{B}$) + Offline sequence stream table ($N \times 4\text{B}$) | $(M + N) \times 4$ | **92 Bytes** |
| **PREDICTION** | • Frequency ($U \times 4\text{B}$)<br>• Recency ($U \times 4\text{B}$)<br>• Interval Mean & Count ($U \times 8\text{B}$)<br>• Markov Outgoing Totals ($U \times 4\text{B}$)<br>• Markov Edges ($E \times 8\text{B}$)<br>• Previous page pointer (4B)<br>• Prediction score scratchpad ($M \times 4\text{B}$) | $U \times 20 + E \times 8 + M \times 4 + 4$ | **164 Bytes** |

Where:
- $M$ = Cache size (number of frames)
- $N$ = Total page requests in the sequence
- $U$ = Number of distinct unique pages observed
- $E$ = Number of distinct 1st-order Markov transition pairs observed ($p_{\text{from}} \to p_{\text{to}}$)

---

## 🔍 Detailed Breakdown for PREDICTION Engine

For each distinct page $u \in U$:
1. **Frequency Counter ($f_u$)**: $4\text{ Bytes}$ (32-bit unsigned integer).
2. **Recency ($L_u$)**: $4\text{ Bytes}$ (32-bit clock timestamp).
3. **Access Interval**:
   - Rolling mean interval ($\bar{\Delta}_u$): $4\text{ Bytes}$ (32-bit float).
   - Interval count ($N_u$): $4\text{ Bytes}$ (32-bit unsigned integer).
4. **Transition Information**:
   - Outgoing transition totals per source page: $4\text{ Bytes}$.
   - Directed transition edge: $8\text{ Bytes}$ ($4\text{B}$ destination page ID + $4\text{B}$ transition frequency count) per edge.
   - Previous page register: $4\text{ Bytes}$.
5. **Prediction Score Scratchpad**:
   - Evaluated score float per resident frame during candidate scoring: $M \times 4\text{ Bytes}$.

---

## 🎤 Viva Talking Points for OS Teacher
1. **Why does FIFO have $M \times 4 + 8$ Bytes?**
   *"In addition to head and tail pointers (8 Bytes), tracking arrival order among $M$ slots requires $M$ slot indices (4 Bytes each) in a circular queue."*
2. **Why does LRU have $M \times 8$ Bytes?**
   *"To maintain constant-time $O(1)$ updates on cache hits, LRU uses a doubly linked list requiring 2 pointers (`prev` and `next`, each 4 Bytes) per cache frame."*
3. **Why does Optimal have higher memory overhead than LRU?**
   *"Because Belady's Optimal is an offline algorithm requiring access to the future reference string ($N \times 4\text{ Bytes}$), demonstrating why it is theoretical and impractical for online hardware controllers."*
4. **How does the Prediction Engine stay lightweight?**
   *"Instead of neural networks with millions of floating-point weights, our prediction model uses compact integer/float hash statistics ($< 1\text{ KB}$ for typical workloads), making it practical for memory controllers."*