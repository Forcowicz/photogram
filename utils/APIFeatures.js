class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  limit() {
    if (this.queryString.limit) {
      this.query = this.query.limit(this.queryString.limit);
    }

    return this;
  }

  search(field) {
    if (this.queryString.search) {
      this.query = this.query.find({ [field]: new RegExp(`^${this.queryString.search}`, "gi") });
    }

    return this;
  }

  select() {
    if (this.queryString.select) {
      this.query = this.query.select(this.queryString.select.replaceAll(",", " "));
    }

    return this;
  }
}

module.exports = APIFeatures;
