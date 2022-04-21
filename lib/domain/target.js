module.exports = class {
  constructor(id, firstName, lastName, email, password) {
    this.id = Number;
    this.url = String;
    this.value = Number;
    this.maxAcceptsPerDay = Number;
    this.accept = {
      geoState: {
        $in: [String],
      },
      hour: {
        $in: [Number],
      },
    };
  }
};
