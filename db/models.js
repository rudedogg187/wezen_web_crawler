const fs = require("fs");
var dataPath = "./db/data/";

var schema = {
  user: [
    { name: "userName", type: "string", key: 0 }, 
    { name: "userId", type: "string", key: 1 },
    { name: "thumbNail", type: "string", key: 0 },
  ],
};

var model = {
  user: {
    schema: schema.user,
    data: dataPath + "user",

  },
};

function format(d, t) {
  return d;
}


function isIn(d, r, k, v) {
  var f = d.filter( (f) => {
    if( f[k] == v ) { return f; }
  })

  if(f.length > 0) {
    console.log("key error");
    return 1;
  }
  return 0;
}


function readData(dp, cb) {
  fs.readFile(dp + ".json", "utf-8", (err, data) => {
    if(data == null) {
      data = "[]";
    }
    cb(JSON.parse(data));
  })
}

function writeData(dp, d, cb) {
  fs.writeFile(dp + ".json", JSON.stringify(d), (err) => {
  })
}


module.exports = {
  insert: (m, d, cb) => {
    var schema = model[m].schema;
    var record = {};
    var keyVal = [];
    var key = null;;
    schema.forEach( (c) => {
      val = format(d[c.name], c.type);
      record[c.name] = val;
      if( c.key == 1 ) {
        key = c.name;
        keyVal = val;
      }
    })
    readData(model[m].data, (d) => {
      record.appId = d.length;
      record.addDt = new Date();
      if(isIn(d, record, key, keyVal) == 0 && keyVal != null)  {
        d.push(record);
        writeData(model[m].data, d);
      }
      if(keyVal != null) {
        cb(record);       
      }
    })
  },

  select: (m, r, cb) => {
    readData(model[m].data, (d) => {
      var data = d.filter( (f) => {
        var g = 0;
        var keys = Object.keys(r);
        keys.forEach( (k) => {
          var tgtVal = r[k];
          var tstVal = f[k];
          if(tgtVal == tstVal) { g++; }
        })

        if(g == keys.length) { return f };
      })
      cb(data);
    })

  },


}





