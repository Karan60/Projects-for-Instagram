function myColor()
 {
  var color = document.getElementById('colorPicker').value;
  document.body.style.backgroundColor = color;
  document.getElementById('box').value = color;
}
document.getElementById('colorPicker')
  .addEventListener('input', myColor);
document.getElementById('copy-btn')
  .addEventListener('click', function() 
  {
    var hexCode = document.getElementById('box').value;
    navigator.clipboard.writeText(hexCode);
    alert("Hex code copied to clipboard!");
  });