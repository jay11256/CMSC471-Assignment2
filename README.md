# CMSC471-Assignment2
Lying ideas
- Misleading scales (truncated axes - x or y only show a small window)
- Cumulative graphs 
- "Ignoring conventions"
    - Flipping y-scale
- Two overlaid graphs, each following a different scale
- Oversimplification of complex datasets
    - Using a small number of categories to sort data?
- [Misleading risk representations by not normalizing](https://mucollective.northwestern.edu/files/2024-V-FRAMER.pdf) 




(Subset of) Dataset: [NYPD](https://projects.propublica.org/datastore/#civilian-complaints-against-new-york-city-police-officers)

What data do we want to visualize?
- Complaints by 
    - officer gender / complainant gender
    - officer race / complainant race
    - Represent discrimination by Offensive Language allegation type?
    - Cumulative plot of discrimination
        - -ISM is on the rise!!!!
    - Gender - female mos get fewer complaints (cause there are fewer female mos)
        - Same with race (white people)
    
    - Compute percent of compaints substantiated per group
    - proportion of complains that involve offensive language by MOS ethnicity

    - Filter by ages / year of complaint

- Something where we can normalize the data (data transformation "requirement")
- ⭐ Filter (or don't filter) out exonerated/unsubstantiated claims 


- Stuff to include in writeup

    - White hat:
        - Aggregation: For each year, complaints of each type are aggregated
        - Sorted by board disposition

    - Black hat:
        - Aesthetically similar, however:
        - Omits Asian, American Indian, and Other races, leaving out crucial information
        - Fails to provide context about MOS demographics that would explain disparities in allegation count
        - Truncates significant portion of graph, leading to misleading visual proportions
        - The color scale also emphasizes the narrative that white MOS are significantly worse / receive more complaints
