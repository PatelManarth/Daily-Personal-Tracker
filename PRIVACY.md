# Privacy and data storage

This is a static, local-first application.

- Daily logs, weight records, measurements, check-ins, product overrides and adjustments are stored in the browser's IndexedDB database.
- The application does not send personal tracking records to this GitHub repository.
- The repository contains application code and default planning information only.
- Clearing browser or site data may erase local records.
- A dated JSON backup should be exported every Sunday and before importing another backup.
- The current version does not synchronize between devices or browsers.
- A client-side password prompt would not provide real security and is intentionally not used.

The GitHub Pages website itself is publicly reachable. Search indexing is discouraged through `robots.txt` and a `noindex` page directive, but these are not authentication controls.
