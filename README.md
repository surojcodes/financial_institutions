# Financial Institutions in Nepal

> Simple **REST API** for financial institution CRUD.
> Made using **Nodejs (Express js)** and **MongoDB (mongoose.js)**

###### Some Features
* Category create, update, read and delete
* Add banks by category
* Get all banks in a category
* Bank read, update and delete
* Upload logo for banks
* *Custom error handling with asynchronous middleware*
* *Custom validation* in mongoose schema
* Advanced results supported for reading bank information
  * can *search using specific field value* in the schema
    (fetch all banks with slug nepal-finace-ltd)

  ```
    /api/v1/banks?slug=nepal-finance-ltd
  ```
  * can *select particular fields* in results
    (fetch all bank's name and emails field only)
  ```
    /api/v1/banks?select=name,emails
  ```
  * *Search inside array* fields
    (fetch all banks whose contact array has number 4565678)
  ```
    /api/v1/banks?contact[in]=4565678
  ```
  * *Sort* the results (default is by creation date/latest first)
    (fetch all the bank and sort the records by descending order of name)
  ```
    /api/v1/banks?sort=-name
  ```
  * *Pagination* (default is 5 results per page)
    (fetch all banks, limit 3 results per page and show page number 2 )
  ```
    api/v1/banks?limit=3&page=2
  ```
* *Populate and reverse populate using virtuals*
* *Automatic Slug* genetation using mongoose *pre hook*
* *Regular Expression* for email and url validation
* *Serving Static folders* feature for logos

