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

A goal I would definitely recommend is data redundancy. One bucket should be a source of truth. The data may come in many forms including JSON from API, Jupyter notebook, CSV, and even PDFs that need to have data OCRd or extracted. However, once the data is in NoSQL documents, it is optional to keep the documents. It can be useful to keep in storage briefly to make sure no errors in data extraction have occurred, but after that, it is unnecessary. The data should otherwise be unaltered from the sources aside from a source identifier. This source identifier make sure the data is indexable by each source.

Each source identifier could also be associated with a source entry like in [JSON schema](https://json-schema.org/) with types. This is important to be separate from the raw files as mistakes will happen in data entry. For example, a `Date` column could be ISO format, unix, etc. Otherwise fixing type errors at the document level would then force all documents to be changed. Changing it on a source object level allows the source data to stay read-only even when mistakes happen. It is also important because moving from CSV into a NoSQL database causes a loss of the header row that tells you what data is contained and what can be queried. A NoSQL database is best here due to the variations in schema. Each source entry could also have additional data that is not part of the data itself, but is known about the source. For example, if the year of the election is not provided at a low level, this could be added to the entry object



There's multiple types of data for candidates, votes, jourisdictions, elections. Candidates may run in different jurisdictions because they move. Elections can happen across multiple regions. It's important to see how candidates vote when they move between local and partisan positions.

### What I would do to maximize resources

The easiest way to minimize resource usage is to engage the community.

Firstly, I'd combine efforts with an open voter database like OpenElections.

Secondly if you're contributing to a public database, there are plenty of grants available for contributing to these databases

* https://www.fvap.gov/eo/grants
* https://electionlab.mit.edu/engage/grants/past-recipients

These grants could go towards open data bounties on a site like [DoltHub](https://www.dolthub.com/bounties). 

Even if the business valuation is from the data, it can be for data insights rather than raw data. Sourcing raw data collection from the community can help with spreading awareness of the project.

### Ideas to do the data in-house

Different types of data?


