# Anonymisation-Techniques

This code was written for the Anonymity Techniques assignment of the course Privacy Enhancing Technologies given at the University of Twente. 

To view the assignment, see [03_anonymisation.pdf](03_anonymisation.pdf).

## Running the Code

- Go to [https://nodejs.org/en/download/package-manager] and follow the installation instructions for your specific operating system.
- Clone this repository to a location of your choosing.
- Open your terminal (if on Windows: command prompt).
- In your terminal, navigate to the folder in which you cloned this repo. (In other words, where `package.json` is located).
- Enter the following command: `npm start`.
- Follow the instructions in your terminal.

## Files

- **package.json:** Contains information NodeJS needs to run the application.
- **node\_modules/:** Contains libraries used by application.
- **src/Assignments.js:** In this file the actual anonymisation techniques are used to anonymize the dataset and perform the tasks specified in the assignment.
- **src/CLI.js:** Manages the command line interface used to interact with the program, no assignment specific stuff happens here.
- **src/Dataloader.js:** Reads the data file and parses the values within it. Entries with unknown values are automatically skipped.
- **src/Generalization.js:** Provides the functionality to perform generalization on the adult dataset.
- **src/LocalSuppression.js:** Provides the functionality to perform suppression on the adult dataset.
- **src/Precision.js:** Is used to calculate the precision of generalized dataset.
- **src/Stats.js:** Provides the functionality to calculate various statistics of a dataset for each DGH. Statistics such as number of categories a DGH has in a dataset, mean size of that category, size of smallest category and the categories themselves along with number of entries in each category.
- **data/adult.data:** The actual dataset.
- **data/cols.json:** A simple mapping of the attribute names (age, race, etc.) to their indices in the dataset.
- **data/DGHs.json:** The DGHs as specified in section \ref{sec:domain_generalization_hierarchies.
- **data/public\_data.json:** The public data used for assignment 1 and 5.
- **data/QIDs.json:** The attribute names of the quasi identifiers.
- **data/SEs.json:** The attribute names of the sensitive attributes.
