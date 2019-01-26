module.exports = (app) => {

  app.get('/seeds/depth', (req, res) => {
    var tree = [
      {id:1, url:"https://test.com", children:[2]},
      {id:2, url:"https://test1.com", children:[3]},
      {id:3, url:"https://test2.com", children:[4]},
      {id:4, url:"https://test3.com", children:[5]},
      {id:5, url:"https://test4.com", children:[6]},
      {id:6, url:"https://test5.com", children:[]}
    ];
    res.status = 200;
    res.json(tree);
  });

  app.get('/seeds/breadth', (req, res) => {
    var tree = [
      {id:1, url:"https://test.com", children:[2, 3, 5]},
      {id:2, url:"https://test1.com", children:[]},
      {id:3, url:"https://test2.com", children:[4]},
      {id:4, url:"https://test3.com", children:[6]},
      {id:5, url:"https://test4.com", children:[]},
      {id:6, url:"https://test5.com", children:[]}
    ];
    res.json(tree);
  });

}


