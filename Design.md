# Design

- process per day data per job
- data is stored in tablestorage, tables
    - politicians
    - debates
    - categories
    - jobs
- job[JobType] adds output rss to existing feed
- jobs are created and processed from a db table with jobEntries, a job can create subjobs that are spawned async
- JobTypes differentiate; you can have a politicianOuputType that generates a feed for a specific politician. The input differs from other types, processing of it is generally the same, but can differ
- Possible JobTypes;
    - main ( full timeline from api with all debates, stemmingen, regeling van werkzaamheden etc)
    - debates ( full timeline from api with only debates)
    - plenair ( full timeline from api with only debates from planaire zaal)
    - Troelstrazaal ( full timeline from api with only debates from troelstrazaal)
    - politician/[politicianSlug] A feed with all debates with [politicianSlug] in it
    - category/[categorySlug] A feed with all debates with [categorySlug] in it
- Each job has or inherits a processing pipeline, resulting in a string with rss output

## To consider

- output write should be decoupled
- output upload should be decoupled


### Job Objects

Extend from a AbstractJob.
What does a job need to do or contain?
- a job has a status, type
- a job has a method that retrieves data
- a job has a method to map retrieved data to fixed fields needed for generating RSS
- a job has a method that generates rss
- a job has a method to save RSS to a file or another endpoint
- a job has methods to save data to the database