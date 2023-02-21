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

Firstly, setting up a data architecture needs to have a set of goals that are consistent and help keep things on the same page as things change. For example, some data goals could be to educate folks on how to vote. This means the focus is less on historic data and so data can be limited to recent previous years just enough to understand how current elected officials have voted on things, but not too far back. 

In this case, redundancy is 

Firstly, one bucket should be a source of truth. It is the raw data from the sources. When data is fetched, it is always stored here as is. This is to make sure there is no information loss when schema's change on our end. A NoSQL database is best here due to the variations. In the source-of-truth bucket, each piece of data should be associated with a schema set ID and s from the source??? Like sources with years with similar schema

There's multiple types of data for candidates, votes, jourisdictions, elections. Candidates may run in different jurisdictions because they move. Elections can happen across multiple regions. It's important to see how candidates vote when they move between local and partisan positions.

### What I would do to maximize resources

The easiest way to minimize resource usage is to engage the community.

Firstly, I'd combine efforts with an open voter database like OpenElections.

Secondly if you're contributing to a public database, there are plenty of grants available for contributing to these databases

* https://www.fvap.gov/eo/grants
* https://electionlab.mit.edu/engage/grants/past-recipients

These grants could go towards open data bounties on a site like [DoltHub](https://www.dolthub.com/bounties)

### Ideas to do the data in-house

Different types of data?


