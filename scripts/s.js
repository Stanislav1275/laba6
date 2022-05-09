import {menu} from '../state.js'
import {products} from "../state.js";
// import audio from "../sounds/heat.mp3";

let dependences = {
    btnFilter: document.querySelector('.app-wrapper header .right_h button'),
    cards: document.querySelector('.cards'),
    menu: document.querySelector('.menu'),
    products: document.querySelector('.app-wrapper .menu .products'),
    time: document.querySelector('.app-wrapper .menu .time_slider'),
    cal: document.querySelector('.app-wrapper .menu .cal_slider'),
    bju: document.querySelectorAll('.bju button'),
    prodList:document.querySelectorAll('.app-wrapper .menu .products .span_check'),
    checkList:document.querySelectorAll('.checklist'),
    themeInner:document.querySelector('.theme .cont button .text'),
    themeBtn:document.querySelector('.theme .cont'),
    circles:document.querySelectorAll('.circles li')
}

let selected = null;
function getCoords(elem) {   // кроме IE8-
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}
document.querySelector(".circles").addEventListener("mousedown", e => {
    let coords = getCoords(e.target);
    let x = e.clientWidth/2, y = e.clientHeight/2
    let shiftX = e.pageX - coords.left;
    let shiftY = e.pageY - coords.top;
    let tr = false
    if (e.target.closest(".circles li")) {

        if (selected) {
            if(!selected.classList.contains("animated")){
                selected.classList.add("animated");
                tr = false
            }
            else{

                selected.classList.add("animated");
                tr = true;
            }

        }
        selected = e.target;
        if(tr){
            document.onmousemove = function(e) {
                selected.style.top = e.clientY -shiftY + 'px'
                selected.style.left = e.clientX -shiftX + 'px'
            };

            selected.onmouseup = function() {
                document.onmousemove = null;
                selected.onmouseup = null;
            };
            selected.classList.remove("animated");

        }


    }
}, false);
function changeThemeBtn(){
    let count = 1;
    return function (t=null){
        Array.from(document.querySelectorAll('.theme .cont button .text p')).forEach(p => {p.remove()})
        // console.log(count)
        let title;
        if(count==4)count = 1;
        t = (t==null)?count:t;
        title = (t==1)?"ТЁМНАЯ":(t==2)?"СВЕТЛАЯ":"УПОРОТАЯ"
        document.body.className = (title=="ТЁМНАЯ")?"dark":(title=='СВЕТЛАЯ')?"light":"strange"
        for(let t of title){
            dependences.themeInner.insertAdjacentHTML("beforeend", `
            <p>${t}</p>   
        `)
        }
        return count++;
    }
}

let changeTheme = changeThemeBtn()
dependences.themeBtn.addEventListener('click', () => {
    let th = changeTheme()
    // console.log(th)
    localStorage.setItem("th", th);
})
function play(url){
    new Audio(url).play();
}
let btns = document.querySelectorAll('button')
btns.forEach(btn=>{
    btn.addEventListener('click', () => {
        play("../sounds/heat.mp3")
    })
})

function Product(prod = dependences.products) {

    products.forEach(product => {
        prod.insertAdjacentHTML("afterbegin", `
                <label class="checkbox-btn">
	                <input type="checkbox" class="checklist">
	                <span class = "span_check">${product}</span>
                </label>
        `)
    })
}
function localeInit(time = dependences.time, cal = dependences.cal, bju = null, prodList = null){
    console.log("init")
    console.log(localStorage)
    if(localStorage.length>0){
        // removeCards()
        changeTheme(localStorage.getItem("th"))

        let itemS, c,b,t

        itemS = JSON.parse(localStorage.getItem("itemS"))
         let times = [
            {value:localStorage.getItem("beforeT")},
             {value:localStorage.getItem("afterT")},

         ]
        t = {
            before: times[0].value,
            after: times[1].value,

        }

        cals = [
        {value:localStorage.getItem("beforeC")},
        {value:localStorage.getItem("afterC")},

    ];
        c = {
            before: cals[0].value,
            after: cals[1].value,
        }
        b = (localStorage.getItem("bju"))
        // console.log(b)
        let t_list = time.children, c_list = cal.children
        t_list[0].value = t.before
        t_list[1].value = t.after
        c_list[0].value = c.before
        c_list[1].value = c.after
        dependences.bju.forEach(b1 => {
            let inner = b1.innerText[0]
            // console.log(inner)
            if(b==inner){
                b1.className = "activeB"
            }
        })
        let prodList = Array.from(document.querySelectorAll('.span_check'))
        Array.from(document.querySelectorAll('.checklist')).map((prod, index) => {
            let inner = prodList[index].innerHTML
            for(let checked of itemS){
                if(inner==checked)                prod.checked = true;
                //
                if(checked == inner)prod.checked = true;
            }
        })
        fillCards(menu, {...t}, {...c},b, itemS)
    }
    else{
        changeTheme()

        let itemS, c,b,t

        itemS = [...(document.querySelectorAll('.products .checkbox-btn input[type=checkbox]:checked + span'))]
        itemS = itemS.map(item => item.innerHTML)
        let times = time.children;
        t = {
            before: times[0].value,
            after: times[1].value,

        }

        cals = cal.children;
        c = {
            before: cals[0].value,
            after: cals[1].value,
        }
        if(document.querySelector('.activeB h1'))b = document.querySelector('.activeB h1').innerHTML[0]
        else b = null
        // console.log(b)
        console.log("beforeI")
        console.log(localStorage)

        localStorage.setItem("bju",b)
        localStorage.setItem("beforeT", (t.before))
        localStorage.setItem("afterT", (t.after))
        localStorage.setItem("beforeC", (c.before))
        localStorage.setItem("afterC", (c.after))
        localStorage.setItem("itemS", JSON.stringify(itemS))
        console.log("afterI")
        console.log(localStorage)

        // console.log(localStorage)


        fillCards(menu, {...t}, {...c},b, itemS)
    }

}
function fillCards(menu, {before: beforeT, after: afterT}, {before: beforeC, after: afterC}, bju = null, prodList = null) {
    removeCards();
    // console.log(bju)
    let i = 0;
    // if (bju) {
    //     console.log(bju)
    // }
    let t = [], c = [], b = [], ct = [], p = []
    let cards = menu.map(card => new Card({...card}, i++))
    cards.forEach(card => {
        card.addCard()
    })
    if(prodList!= null){
        p = cards.map(card=>{
            // console.log(card)
            if(prodList.length == 0)return true;
            for(let ing of card.ing.split(',')){
                for(let product of prodList){
                    if(ing.includes(product)){
                        return true;
                    }
                }
            }
            return false
        })


    }
    else p=  cards.map(card=>true)

    if(bju == null || bju == 'null') {
        b = cards.map(card => true)
    }
    else {
        b = cards.map(card => {

            let max = (Math.max(...[card.b, card.j, card.u]))
            // console.log(bju)
            if (bju == 'б') {

                return (max == card.b)
            } else if (bju === 'ж') return (max == card.j)
            else return (max == card.u)

        })
    }
    // console.log(b)

    // console.log(b)
    t = cards.map(card => {
        let time = +card.time
        if ((afterT == 0)) return true
        return checkFilter((time >= +beforeT) && (time <= +afterT))
    })
    c = cards.map(card => {
        let call = +card.cal
        if ((afterC == 0)) return true

        return ((+call >= +beforeC) && (+call <= +afterC)) ? true : false

    })
    for (let i = 0; i < c.length; i++) {
               ct.push(c[i] && t[i] && b[i] && p[i])
    }

        cards.forEach((card, index) => {
        if (!ct[index]) {
            card.removeCard(card.id)
        }
    })

}

function removeCards() {
    let cards_list = [...document.querySelectorAll('.card')]
    cards_list.forEach(card => {
        if (card) (card.remove())
    })
}
function removeCard  (id) {
    if(document.querySelector(`div#c${id}.card`))
        document.querySelector(`div#c${id}.card`).remove()
    // }
}
// (getOptions())

Product()

function checkFilter(callback) {
    return !!callback
}

function Card({img, time, cal, b, j, u, ingredients, title}, i) {
    this.time = time;
    this.cal = cal;
    this.b = b;
    this.j = j;
    this.u = u;
    this.ing = ingredients;
    this.title = title
    this.id = i;

    this.removeCard = function (id) {
        (document.querySelector(`div#c${id}.card`).remove())
    }
    this.addCard = function () {
        let block = document.querySelector('main');
        let gradientCal = (this.cal >= 200) ? "full" : (this.cal < 200 && this.cal >= 35) ? "medium" : "low";
        let timeStr = (time <= 60) ? `${time}m` : `${((time / 60) | 0)}.${time % 60}h`
        block.insertAdjacentHTML("beforeend", `
            <div class="card" id = "c${i}">   
                <div class="time cblack">
                    <h1>${timeStr}</h1>
                </div>
            <div class="battery ${gradientCal}">
                <div class="count">
                    <h1 id ='cal'>
                    ${this.cal}
                    <h1>на</h1>
                    <h1>100г</h1>
                    </h1>
                </div>
                <div class="main">
                      <div class="head"></div>
                       <div class="items">
                           <div class="battery__item"></div>
                           <div class="battery__item"></div>
                           <div class="battery__item"></div>                                           
                       </div>
                </div>           
            </div>
            <div class="bju">
                <table cellpadding="0" cellspacing="0">
                    <tr>
                         <th class="green__block">Б</th>
                         <th class="red__block">Ж</th>
                         <th class="blue__block">У</th>
                    </tr>
                    <tr>
                         <td class="green__txt">${b}</td>
                         <td  class="red__txt">${j}</td>
                         <td  class="blue__txt">${u}</td>

                    </tr>
                </table>
            </div>
            <div class="card__image">
                <img src=${img}
                     alt="" class="card_cover">
            </div>
            <div class  = "card__info">
                <div class="title">
                    <h1>              ${this.title}
</h1>
                </div>
                <div class="about">
                    <h1>
                    ${this.ing}
                    </h1>
                </div>

            </div>
            </div>
            
        `)
    }
}

function animate(object) {

    // let sq = document.querySelector('.square-wrapper');

    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            let entrySquare = entry.target.querySelector('.card__image');
            // console.log(entrySquare)
            if (typeof getCurrentAnimationPreference === 'function' && !getCurrentAnimationPreference()) {
                return;
            }

            if (entry.isIntersecting) {
                entrySquare.classList.add('card__image__animation');
                return;
            }

            entrySquare.classList.remove('card__image__animation');
        });
    });

    observer.observe(object);
};

function bjuActive(b = null, btn = dependences.bju) {
    let active = false;
    if(b.className!='activeB')
    b.className = "activeB"
    else {
        b.className = "passiveB"
    }
    btn.forEach(b1 => {
        if (b1 != b) {
            b1.className = "passiveB"
        }
    })
    getOptions()

}



function filterBtnActive(btn = dependences.btnFilter, menu = dependences.menu, cards = dependences.cards) {
    let active = false;

    return function f() {


        if (!active) {
            cards.classList.add('active')

            // setTimeout(() => {
            menu.classList.add('active')
            active = true;

            // }, 20)
        } else {
            menu.className = "menu"
            // setTimeout(() => {
            active = false;
            cards.className = "main cards"
            // }, 600)
        }
    }

}

function getOptions(time = dependences.time, cal = dependences.cal, bju = null, prodList = null) {
    // console.log(localStorage)

    // if(time!==null){
    let itemS, c, b, t;

    itemS = [...(document.querySelectorAll('.products .checkbox-btn input[type=checkbox]:checked + span'))]
    itemS = itemS.map(item => item.innerHTML)
    let times = time.children;
    t = {
        before: times[0].value,
        after: times[1].value,
    }
    cals = cal.children;
    c = {
        before: cals[0].value,
        after: cals[1].value,
    }
    b = (document.querySelector('.activeB h1'))?document.querySelector('.activeB h1').innerHTML[0]:null;
    console.log("beforeG")
    console.log(localStorage)

    localStorage.setItem("beforeT", (t.before))
    localStorage.setItem("afterT", (t.after))
    localStorage.setItem("beforeC", (c.before))
    localStorage.setItem("afterC", (c.after))
    localStorage.setItem("bju", b)
    localStorage.setItem("itemS", JSON.stringify(itemS))
    console.log("afterG")
    console.log(localStorage)


    fillCards(menu, {...t}, {...c},b, itemS)
}

let bjus = [...dependences.bju]

let times = [...dependences.time.children];
let cals = [...dependences.cal.children];
dependences.products.addEventListener('change', () => {

    getOptions()
})
bjus.forEach(bju => {
    bju.addEventListener('click', (e) => {
        bjuActive(e.currentTarget, dependences.bju)
        // getOptions(dependences.time,dependences.cal,e.currentTarget.innerText)
    })
})
times.forEach(time => {
    time.addEventListener('change', (e) => {
        getOptions()
        // if (document.querySelector('.activeB'))
        //     document.querySelector('.activeB').className = "passiveB"
    });
})
cals.forEach(cal => {
    cal.addEventListener('change', (e) => {
        getOptions()
        // if(document.querySelector('.activeB'))
        // document.querySelector('.activeB').className = "passiveB"
    });
})

localeInit()
const f1 = filterBtnActive()
dependences.btnFilter.addEventListener('click', (e) => {
    f1()

})
// console.log(document.querySelectorAll('.card'))
document.querySelectorAll('.card').forEach(card => {
    animate(card)
})
