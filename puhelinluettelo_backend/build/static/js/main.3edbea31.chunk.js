(this.webpackJsonppuhelinluettelo=this.webpackJsonppuhelinluettelo||[]).push([[0],{19:function(e,t,n){},57:function(e,t,n){"use strict";n.r(t);var o=n(4),a=n(0),s=n.n(a),l=n(28),c=n.n(l),r=(n(19),n(9)),u=n(10),i=n.n(u),d="/api/persons",j=function(){return i.a.get(d)},m=function(e){return i.a.post(d,e)},b=function(e){return console.log("Poistetaan k\xe4ytt\xe4j\xe4 ID:",e),console.log("Osoitteesta",d,"/",e),i.a.delete("".concat(d,"/").concat(e))},f=function(e,t){return i.a.put("".concat(d,"/").concat(e),t)},h=n(18),g=n(29),O=n(13),p=n(7),v=function(e){return Object(o.jsxs)(O.a,{children:[e.name,": ",e.number,Object(o.jsx)(h.a,{className:"numberButton",type:"submit",onClick:function(){var t="Delete "+e.name;console.log(t),window.confirm(t)&&(console.log("Klikattu poista henkil\xf6\xf6n:",e.name,"jonka ID on",e.id),b(e.id).then((function(t){console.log("Palvelin vastasi uuteen tietoon:",t),e.setErrorMessage("Deleted ".concat(e.name)),setTimeout((function(){e.setErrorMessage(null)}),5e3),console.log("effect alkaa"),j().then((function(t){console.log("p\xe4ivitet\xe4\xe4n",t),e.setPersons(t.data)})),console.log("Dataa l\xf6ydetty:",t.length,"kpl")})).catch((function(t){console.log("Virhe poistaessa, tulostetaan virheilmoitus"),e.setErrorMessage("Name and number were already removed from server"),setTimeout((function(){e.setErrorMessage(null)}),5e3)})))},children:"Delete"})]},e.id)},x=function(e){return console.log("Tulostetaan Ihmisten hallintaan k\xe4ytetty lista",e),Object(o.jsx)(g.a,{children:e.filteredPersons.map((function(t){return Object(o.jsx)(v,{name:t.name,number:t.number,id:t.id,setErrorMessage:e.setErrorMessage,setPersons:e.setPersons},t.id)}))})},k=function(e){return Object(o.jsx)(p.a,{children:Object(o.jsxs)(p.a.Group,{children:[Object(o.jsx)(p.a.Label,{children:"Search:"}),Object(o.jsx)(p.a.Control,{type:"text",placeholder:"Search users by name",value:e.newFilter,onChange:e.filterMuuttuu})]})})},w=function(e){return Object(o.jsxs)(p.a,{onSubmit:e.addNote,children:[Object(o.jsxs)(p.a.Group,{children:[Object(o.jsx)(p.a.Label,{children:"Name:"}),Object(o.jsx)(p.a.Control,{type:"text",placeholder:"Enter new name",value:e.newName,onChange:e.nimiMuuttuu})]}),Object(o.jsxs)(p.a.Group,{children:[Object(o.jsx)(p.a.Label,{children:"Number:"}),Object(o.jsx)(p.a.Control,{type:"text",placeholder:"Enter new number",value:e.newNumber,onChange:e.numeroMuuttuu})]}),Object(o.jsx)(p.a.Group,{children:Object(o.jsx)(h.a,{className:"filterButton",type:"submit",children:"Submit"})})]})},y=function(e){var t=e.message;return null===t?null:"Name and number were already removed from server"===t?Object(o.jsx)("div",{className:"fail",children:t}):Object(o.jsx)("div",{className:"success",children:t})},N=function(){var e=Object(a.useState)([]),t=Object(r.a)(e,2),n=t[0],s=t[1],l=Object(a.useState)(""),c=Object(r.a)(l,2),u=c[0],i=c[1],d=Object(a.useState)(""),b=Object(r.a)(d,2),h=b[0],g=b[1],O=Object(a.useState)(""),p=Object(r.a)(O,2),v=p[0],N=p[1],M=Object(a.useState)(null),P=Object(r.a)(M,2),S=P[0],E=P[1];Object(a.useEffect)((function(){console.log("effect alkaa"),j().then((function(e){console.log("effect -> promise fulfilled",e),s(e.data)}))}),[]),console.log("Dataa l\xf6ydetty:",n.length,"kpl");var C=n.filter((function(e){return e.name.toLocaleLowerCase().includes(v.toLowerCase())}));return Object(o.jsxs)("div",{children:[Object(o.jsx)("h1",{children:"Phonebook"}),Object(o.jsx)(y,{message:S}),Object(o.jsx)(k,{newFilter:v,filterMuuttuu:function(e){console.log("filtterikentt\xe4 muuttuu:",e.target.value),N(e.target.value)}}),Object(o.jsx)("h2",{children:"Add a new"}),Object(o.jsx)(w,{addNote:function(e){e.preventDefault(),console.log("Saatu sis\xe4lt\xf6",u);var t=n.map((function(e){return e.name}));console.log("Nimien listassa nyt:",t);var o={name:u,number:h};if(t.includes(u)){if(window.confirm("".concat(u," is already added to phonebook, replace the old number with a new one?"))){var a=n.filter((function(e){return e.name===o.name}));f(a[0].id,o).then((function(e){console.log("Palvelin vastasi uuteen tietoon:",e),i(""),g(""),j().then((function(e){console.log("effect -> promise fulfilled",e),s(e.data)})),console.log("Dataa l\xf6ydetty 3:",n.length,"kpl"),E("Updated number for ".concat(o.name)),setTimeout((function(){E(null)}),5e3)}))}}else console.log("Pusketaan listaan seuraavat tiedot severille: ",o),m(o).then((function(e){s(n.concat(e.data)),console.log("Palvelin vastasi uuteen tietoon:",e),i(""),g(""),E("Added ".concat(o.name)),setTimeout((function(){E(null)}),5e3)})),console.log("Listassa nyt: ",n)},newName:u,nimiMuuttuu:function(e){console.log("tekstikentt\xe4 muuttuu:",e.target.value),i(e.target.value)},newNumber:h,numeroMuuttuu:function(e){console.log("numerokentt\xe4 muuttuu:",e.target.value),g(e.target.value)}}),Object(o.jsx)("h2",{children:"Numbers"}),Object(o.jsx)(x,{filteredPersons:C,setErrorMessage:E,setPersons:s}),Object(o.jsx)("a",{href:"https://github.com/Totalderp/Phonebook",children:"Source code on GitHub"})]})};n(56);c.a.render(Object(o.jsx)(s.a.StrictMode,{children:Object(o.jsx)(N,{})}),document.getElementById("root"))}},[[57,1,2]]]);
//# sourceMappingURL=main.3edbea31.chunk.js.map