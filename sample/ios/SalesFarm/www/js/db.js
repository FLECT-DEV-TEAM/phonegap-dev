define([], function() {
  return {
    _cache : {},
    getConn: function() {
      if (this._cache.db) {
        return this._cache.db;
      } else {
        this._cache.db = window.openDatabase(
            "hello",
            "1.0",
            "Hello",
            100000
        );
        return this._cache.db;
      }
    }
  };
});