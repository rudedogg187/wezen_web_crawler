document.addEventListener("DOMContentLoaded", function(e) {
  $.ajax({
    url: '/crawl/breadth',
    method: 'POST',
    data: {steps: 5, word: 'This is a test word', url:'https://oregonstate.edu/'},
    dataType: 'json',
    success: function(res) {
      populateTree(res);
    },
    error: function(err) {
      alert('Error getting data');
    },
  });
});

function populateTree(tree) {
  var treeCanvas = document.getElementById('tree-canvas');
  var rootNode = tree[0];
  var children = [];
  rootNode.children.forEach(function(item) {
    children.push(item);
  });
  //Children being changed here from list<integer> to list<object>
  children = getChildrenByIdArray(children, tree);
  treeCanvas.textContent = rootNode.url;
  children.forEach(function (item) {
    treeCanvas.textContent += '-> ' +  item.url;
  });
}

function getChildrenByIdArray(children, tree) {
  var returnChildren = [];
  tree.forEach(function(item) {
    children.forEach(function (childId) {
      if(item.id == childId) {
        returnChildren.push(item);
      }
    });
  });
  return returnChildren;
}
