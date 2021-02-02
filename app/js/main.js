let map;

function initMap() {
    var myLatlng = new google.maps.LatLng(50.41216032092543, 30.52261685488979);
    var mapOptions = {
        zoom: 18,
        center: myLatlng,
        mapTypeId: 'satellite'
    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
    setDepartments('Киевская');
}



const select = document.getElementById('departmens-select');



let unique = departments.map(item => item.region).filter((value, index, self) => self.indexOf(value) === index);

const optionTemplate = document.getElementById('optionTemplate').content;
const departmentsItemTmpl = document.getElementById('departmentsItem').content;
const departmentsList = document.getElementById('departmentsList');

const pickupStr = 'Возможен самовывоз';

let option = optionTemplate.querySelector('option');
let optionText = optionTemplate.querySelector('option p');

function setOptions(arr) {
    arr.forEach(element => {
        option.setAttribute('value', element);
        optionText.textContent = `${element} область`;
        let clone = document.importNode(optionTemplate, true);
        select.appendChild(clone);
    });
}

setOptions(unique); 


let currentDepartments = departments.filter(elem => elem.region === select.value);


select.addEventListener('change', function (e) {  
    selectedRegion = this.value;
    currentDepartments = departments.filter(elem => elem.region === selectedRegion);
    setDepartments(selectedRegion);
    setPlaces(currentDepartments);
    return currentDepartments;
});



const setDepartments = (val) => {

    removeAllChildNodes(departmentsList);

    displayDepartments(currentDepartments, departmentsItemTmpl, departmentsList);
}

const displayDepartments = (arr, tmpl, parentList) => {
    removeAllChildNodes(parentList);
    arr.forEach(element => {

        let parent = tmpl.firstElementChild;
        let itemTitle = parent.querySelector('.departments-item__title');
        itemTitle.textContent = element.title;
        let itemCity = parent.querySelector('.departments-item__city');
        itemCity.textContent = element.city;
        let itemRegion = parent.querySelector('.departments-item__region');
        itemRegion.textContent = `${element.region} область`;
        let itemAddr = parent.querySelector('.departments-item__address');
        itemAddr.textContent = element.address;
        let itemPhone = parent.querySelector('.departments-item__phone');
        itemPhone.textContent = element.phone;
        let itemPickup = parent.querySelector('.departments-item__pickup');
        (element.pickup === 1) ? itemPickup.textContent = pickupStr: itemPickup.textContent = '';
        let itemShedule = parent.querySelector('.departments-item__shedule');
        removeAllChildNodes(itemShedule);

        element.shedule.forEach(elem => {
            let p = document.createElement('p');
            p.textContent = elem;
            itemShedule.appendChild(p);
        });

        parent.setAttribute('data-longtitude', element.Longitude);
        parent.setAttribute('data-latitude', element.Latitude);
        let clone = document.importNode(tmpl, true);
        parentList.appendChild(clone);
        setMarkers(element);

        const departmentsItems = parentList.querySelectorAll('.departments-item');


        departmentsItems.forEach(item => {
            item.addEventListener('click', function (e) {
                centerMarker(this);
            });
        });
    });
}

const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function setMarkers(data) {

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.Longitude, data.Latitude),
        map: map
    });
}

function centerMarker(element) {
    const mylat = element.dataset.latitude;
    const mylong = element.dataset.longtitude;
    map.setCenter(new google.maps.LatLng(mylong, mylat));
}


window.onload = () => {
    const departmentsItems = document.querySelectorAll('.departments-item');


    departmentsItems.forEach(item => {
        item.addEventListener('click', function (e) {
            centerMarker(this);
        });
    });
}


let places = [];
const suggestionList = document.getElementById('suggestions-list');
const suggestionTemplate = document.getElementById('suggestion-template').content;



let selectedRegion;

function setPlaces(arr) {
    arr.forEach(elem => {
        places.push(elem.city);
        places.push(elem.address);
        places.push(elem.title);
    });
    let filteredPlaces = places.filter((item, index, self) => self.indexOf(item) === index);
    return filteredPlaces;
}



function getRegion() {
    selectedRegion = select.value;
    return selectedRegion;
}



selectedRegion = getRegion();
places = setPlaces(currentDepartments);

const searchInput = document.getElementById('departmens-search');
let newDep = [];

searchInput.addEventListener('keyup', function (e) {
    let value = e.target.value;

    if (value.length > 1) {
        const suggestions = places.filter(function (suggestion) {
            return suggestion.toLowerCase().includes(value);
        });

        if (suggestions) {
            newDep = [];
            suggestions.forEach(elem => {

                currentDepartments.forEach(item => {
                    if (item.title.indexOf(elem) !== -1) {
                        if (!newDep.includes(item)) {
                            newDep.push(item);
                        }
                    }
                    if (item.address.indexOf(elem) !== -1) {
                        if (!newDep.includes(item)) {
                            newDep.push(item);
                        }
                    }

                    if (item.city.indexOf(elem) !== -1) {
                        if (!newDep.includes(item)) {
                            newDep.push(item);
                        }
                    }

                });

            });

        } else if (!suggestions) {
            newDep = [];
        }


        if (departmentsList.childNodes.length !== 0) {
            removeAllChildNodes(departmentsList);
        }
        displayDepartments(newDep, departmentsItemTmpl, departmentsList);

    }

});