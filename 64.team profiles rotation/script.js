// uncheck radio buttons (unfortunatley this cannot be done with CSS alone)

document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('click', (e) => {
      e.preventDefault();
      // setting a timeout enables this hack to work
      setTimeout(() => radio.checked = !radio.checked, 0);
  });
});