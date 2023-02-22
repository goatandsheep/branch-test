# Branch Test

Complications of data variation:

* County
* State
* Federal

## Questions

* Does data vary year-to-year? I am going to assume it does not for this test
    * County boundaries may change, new counties
    * Schema / data collected may change

## Architecture

Firstly, setting up a data architecture needs to have a set of goals that are consistent and help keep things on the same page as things change. For example, some data goals could be to educate folks on how to vote. This means the focus is less on historic data and so data can be limited to recent previous years just enough to understand how current elected officials have voted on things, but not too far back. Perhaps it could be voting history with a minimum of 5 years where possible. Data goals should also be feasible. Perhaps gerrymandering, i.e. changes to county boundaries is not within the scope because otherwise voting would have to be known at a zip code level.

There's multiple types of data for candidates, votes, jurisdictions, elections. Candidates may run in different jurisdictions because they move. Elections can happen across multiple regions. It's important to see how candidates vote when they move between local and partisan positions, but this data can be established as out-of-scope to minimize a lot of work making connections between candidates with similar names.

A goal I would definitely not recommend is data redundancy. One bucket should be a source of truth and a copy of this data in a more usable form could be in a separate bucket. The data may come in many forms including JSON from API, Jupyter notebook, CSV, and even PDFs that need to have data OCRd or extracted. However, once the data is in NoSQL documents, it is optional to keep the original documents. It can be useful to keep in storage briefly to make sure no errors in data extraction have occurred, but after that, it is unnecessary. The data should otherwise be unaltered from the sources aside from a source identifier. This source identifier makes sure the data is indexable by each source.

Each source identifier could represent a source entry in the database like in [JSON schema](https://json-schema.org/) with types. This is important to be separate from the raw files as mistakes will happen in data entry. For example, a `Date` column could be ISO format, unix, etc. Otherwise fixing type errors at the document level would then force all documents to be changed. Changing it on a source object level allows the source data to stay read-only even when mistakes happen. It is also important because moving from CSV into a NoSQL database causes a loss of the header row that tells you what data is contained and what can be queried. A NoSQL database is best here due to the variations in schema. Each source entry could also have additional data that is not part of the data itself, but is known about the source. For example, if the year of the election is not provided at a low level, this could be added to the entry object.

The reason for using JSON schema is to avoid the need for creating individual scraping scripts for each region. A single script could take a source entry and using the typing hints to dynamically merge and split data to populate a unified data source.

To deal with changing lists of sources, such as subdivisions, incoming elections, and data schema changes, validation may have to happen by hand. However, there can be strategies in place to avoid this. For example, scraping chron jobs can be made to check lists of subdivisions that contain links to the election sites. Reports for each of these jobs can be made to flag if it needs some human intervention, especially a new source link or a changed source link. For upcoming elections, if there is a page where the data is available or even listed, changes in this list will be helpful. Perhaps there could be a source type so within a given data source site for a specific type of vote, new data points can be automatically compared with previous source entries using a JSON schema validator. If it is consistent, a copy of the previous can be used as an initial source entry and can be checked by a human later. If it is inconsistent, the source entry schema can be converted later.

The final goal I'll outline is reducing the front end job. If there is variation in each source, the front end has to be able to account for every single source schema. This is expensive and not time effective. To automate this to some extent, having a unified schema for certain known types (e.g. candidate, election, jurisdiction, etc.) will reduce this. Having a single script that looks at each attribute in a the schema of the source entry and has a standard way to convert it into the unified schema will save a lot of time.

To handle missing data, comparing the number of documents with the expected value should help. There could also be a tolerance which triggers an alarm which would need to be tuned. If there is a page with a list of candidates or data about the number of candidates, that number could be scraped from the pages and compared with the actual number. Again, all source data should have a way for safe human intervention. Data should be versioned, backed up, revertible, and should be able to replace the indexed values when mistakes and updates happen. Validating each data point with the schema is likely not feasible, so the focus should be on missing entries not what is inside.

Front end should also have a way to report a concern about missing or incorrect data including missing elections. 

## Engaging the community

The easiest way to handle the immense amount of human verification is to engage the community.

Firstly, I'd combine efforts with an open voter database like OpenElections.

Secondly if you're contributing to a public database, there are plenty of grants available for contributing to these databases

* https://www.fvap.gov/eo/grants
* https://electionlab.mit.edu/engage/grants/past-recipients

These grants could go towards open data bounties on a site like [DoltHub](https://www.dolthub.com/bounties). If using DoltHub, which is SQL-based, each source could have its own section. The purpose would be a public location for data where humans can be tasked to fix data entry mistakes. Source entries would not need to include typing info as that would be part of SQL, but it would be important to keep it publicly available as it is an important thing validation would change. Dolt uses a system of committing similar to git. Although keeping them in DoltHub could cost fetch time if not in the same datacentre, if it's only used for source and source entries, it would only be used for backup and be fetched when types are fixed due to data entry errors fixed by human.

Source links would also need to be validated by humans.

Even if the business valuation is from the data, it can be for data insights rather than raw data. Sourcing raw data collection from the community can help with spreading awareness of the project.
