const prodName = document.getElementById("prodName");
const prodCat = document.getElementById("prodCat");
const prodPrice = document.getElementById("prodPrice");
const prodDesc = document.getElementById("prodDesc");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const searchInput = document.getElementById("searchInput");
const inputs = document.querySelectorAll(".form-input");
const tableData = document.getElementById("tableData");

const patterns = {
  nameRe: /^[A-Z][a-z\d\s]{2,}(\s[a-z]{2,})?$/,
  categoryRe: /^[A-Z][a-z]*(\s|-)?[a-z]{2,}$/,
  priceRe: /^[1-9][0-9]{2,}/,
  descriptionRe: /[A-Z][a-z0-9-\s]{3,}/,
};
let index = 0;
let storedProducts;
let isValid;
let cnt;
console.log(inputs);

addBtn.addEventListener("click", addProduct);
updateBtn.addEventListener("click", updateProduct);
searchInput.addEventListener("input", searchProducts);

if (localStorage.getItem("storedProducts")) {
  storedProducts = getProducts();
  displayProducts();
} else {
  storedProducts = [];
}

function addProduct(e) {
  isValid = true;
  cnt = 0;
  const product = {
    name: prodName.value,
    category: prodCat.value,
    price: prodPrice.value,
    description: prodDesc.value,
  };

  inputs.forEach((input) => {
    checkRegexp(input);
  });

  if (cnt === 4 && isValid) {
    storedProducts.push(product);
    setLocalStorage();
    displayProducts();
    clearFormInputs();
  } else {
    e.preventDefault();
  }
}

function updateProduct(e) {
  isValid = true;
  cnt = 0;
  const product = {
    name: prodName.value,
    category: prodCat.value,
    price: prodPrice.value,
    description: prodDesc.value,
  };
  inputs.forEach((input) => {
    checkRegexp(input);
  });
  if (cnt === 4 && isValid) {
    console.log(cnt);

    storedProducts.splice(index, 1, product);
    setLocalStorage();
    displayProducts();
    clearFormInputs();
    addBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
  } else {
    e.preventDefault();
  }
}
function checkRegexp(input) {
  let regexp = patterns[input.getAttribute("data-regexp")];
  let value = input.value.trim();
  console.log(regexp);

  if (regexp.test(value)) {
    input.classList.add("valid");
    input.classList.remove("inValid");
    console.log(cnt);

    cnt++;
  } else {
    input.classList.add("inValid");
    input.classList.remove("valid");
    isValid = false;
  }
}

function setLocalStorage() {
  localStorage.setItem("storedProducts", JSON.stringify(storedProducts));
}

function getProducts() {
  return JSON.parse(localStorage.getItem("storedProducts"));
}

function clearFormInputs() {
  prodName.value = null;
  prodCat.value = null;
  prodPrice.value = null;
  prodDesc.value = null;
}

function searchProducts() {
  displayProducts();
}

function update(idx) {
  inputs.forEach((input) => {
    input.classList.remove("inValid");
    input.classList.add("valid");
  });
  console.log("updated " + idx);
  index = idx;
  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
  prodName.value = storedProducts[idx].name;
  prodCat.value = storedProducts[idx].category;
  prodPrice.value = storedProducts[idx].price;
  prodDesc.value = storedProducts[idx].description;
}

function deleteProduct(idx) {
  console.log("deleted " + idx);
  storedProducts.splice(idx, 1);
  setLocalStorage();
  displayProducts();
}

function displayProducts() {
  let data = "";
  let term = searchInput.value.toLowerCase();

  for (let i = 0; i < storedProducts.length; i++) {
    if (storedProducts[i].name.toLowerCase().includes(term)) {
      data += `<tr>
                <td>${i + 1}</td>
                <td>${storedProducts[i].name.toLowerCase()}</td>
                <td>${storedProducts[i].category.toLowerCase()}</td>
                <td>${storedProducts[i].price}</td>
                <td class="desc">${storedProducts[i].description}</td>
                <td>
                  <button class="btn btn-warning btn-sm shadow" onclick="update(${i})">
                    Update <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                </td>
                <td>
                  <button class="btn btn-danger btn-sm shadow" onclick="deleteProduct(${i})">
                    Delete <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>`;
    }
  }
  tableData.innerHTML = data;
}

inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    let regexp = patterns[input.getAttribute("data-regexp")];
    let value = input.value;
    console.log(regexp);

    if (regexp.test(value)) {
      input.classList.add("valid");
      input.classList.remove("inValid");
    } else {
      input.classList.add("inValid");
      input.classList.remove("valid");
      isValid = false;
    }
  });
});
