const menu = [ //Menù completo 11/08/2025
    {
        categoria: "Legenda Allergeni",
        prodotti: []
    },
    {
        categoria: "Caffetteria",
        prodotti: [
            { nome: "Caffè espresso", prezzo: 1.20, immagine: "img/caffetteria/caffe.png", allergeni: [] },
            { nome: "Caffè macchiato", prezzo: 1.20, immagine: "img/caffetteria/caffemac.jpg", allergeni: [] },
            { nome: "Caffè decaffeinato", prezzo: 1.30, immagine: "img/caffetteria/caffe.png", allergeni: [] },
            { nome: "Caffè corretto", prezzo: 1.60, immagine: "img/caffetteria/caffe.png", allergeni: [] },
            { nome: "Orzo e Ginseng", prezzo: 1.40, immagine: "img/caffetteria/orzo.jpg", allergeni: [] },
            { nome: "Cappuccino", prezzo: 1.40, immagine: "img/caffetteria/cappuc.jpg", allergeni: [] },
            { nome: "Tè e tisane", prezzo: 1.30, immagine: "img/caffetteria/te.jpg", allergeni: [] },
            { nome: "Cioccolata calda", prezzo: 2, immagine: "img/caffetteria/cioc.jpg", allergeni: [] },
            { nome: "Ponce", prezzo: 2.50, immagine: "img/caffetteria/ponce.jpg", allergeni: [] },
        ]
    },
    {
        categoria: "Bevande",
        prodotti: [
            { nome: "Acqua 1/2 litro naturale", prezzo: 1, immagine: "img/bevande/acquanat.png", allergeni: [] },
            { nome: "Acqua 1/2 litro frizzante", prezzo: 1, immagine: "img/bevande/acquafrizz.png", allergeni: [] },
            { nome: "Succo di frutta", prezzo: 2, descrizione:"specifica il gusto nelle note", immagine: "img/bevande/succhino.png", allergeni: [] },
            { nome: "Sanbitter (liscio)", prezzo: 2.50, immagine: "img/bevande/bitter.png", allergeni: [] },
            { nome: "Crodino (liscio)", prezzo: 2.50, immagine: "img/bevande/crodinoo.png", allergeni: [] },
            { nome: "Campari Soda (liscio)", prezzo: 3, immagine: "img/bevande/campari.png", allergeni: [] },
            { nome: "Estathè pesca", prezzo: 1.2, immagine: "img/bevande/estapesca.png", allergeni: [] },
            { nome: "Estathè limone", prezzo: 1.2, immagine: "img/bevande/estalimone.png", allergeni: [] },
            { nome: "Varie in bottiglia", prezzo: 2.5, immagine: "img/bevande/cocafanta.png", allergeni: [] },
            { nome: "Coca alla spina (piccola)", prezzo: 2.5, immagine: "img/bevande/cocaspinapiccola.png", allergeni: [] },
            { nome: "Coca alla spina (media)", prezzo: 3.5, immagine: "img/bevande/cocaspinamedia.png", allergeni: [] },
            { nome: "Birra analcolica", prezzo: 3.5, immagine: "img/bevande/analcolica.png", allergeni: [] },
        ]
    },
    {
        categoria: "Birre",
        prodotti: [
            { nome: "Birra alla spina (piccola)", prezzo: 2.5, immagine: "img/birre/birrapiccina.png", allergeni: [] },
            { nome: "Birra alla spina (media)", prezzo: 3.5, immagine: "img/birre/birramedia.png", allergeni: [] },
            { nome: "Birra Corona", prezzo: 2.5, immagine: "img/birre/corona.png", allergeni: [] },
            { nome: "Birra Moretti", prezzo: 2.5, immagine: "img/birre/moretti.png", allergeni: [] },
            { nome: "Birra Icnusa non filtata", prezzo: 3.5, immagine: "img/birre/ichnusa.png", allergeni: [] },
            { nome: "Birra Becks", prezzo: 2.5, immagine: "img/birre/becks.png", allergeni: [] },
            { nome: "Birra Ceres", prezzo: 3.5, immagine: "img/birre/ceres.png", allergeni: [] },
            { nome: "Birra Tennent's", prezzo: 3, immagine: "img/birre/tennents.png", allergeni: [] },
            { nome: "Birra Menabrea", prezzo: 3.50, immagine: "img/birre/menabrea.png", allergeni: [] },
            { nome: "Birra senza glutine", prezzo: 3.5, immagine: "img/birre/glutine.png", allergeni: [] },
            { nome: "Eva - Blond Ale", prezzo: 8, descrizione:"Alc. <b>5,0%</b> - <b>50 cl</b>", immagine: "img/birre/eva.png", allergeni: [] },
            { nome: "Honey - Honey Ale", prezzo: 6, descrizione:"Alc. <b>6,3%</b> - <b>33 cl</b>", immagine: "img/birre/honey.png", allergeni: [] },
            { nome: "Saudade - India Pale Ale", prezzo: 6, descrizione:"Alc. <b>5,5%</b> - <b>33 cl</b>", immagine: "img/birre/saudade.png", allergeni: [] },
            { nome: "Bea - Red Ale", prezzo: 8, descrizione:"Alc. <b>7,0%</b> - <b>50 cl</b>", immagine: "img/birre/bea.png", allergeni: [] },
            { nome: "Catalano - Tripel", prezzo: 8, descrizione:"Alc. <b>8,5%</b> - <b>50 cl</b>", immagine: "img/birre/tripel.png", allergeni: [] },
            { nome: "Tosca - Blanche", prezzo: 8, descrizione:"Alc. <b>4,6%</b> - <b>50 cl</b>", immagine: "img/birre/tosca.png", allergeni: [] },
            { nome: "Kali - India Pale Ale", prezzo: 8, descrizione:"Alc. <b>6,5%</b> - <b>50 cl</b>", immagine: "img/birre/kali.png", allergeni: [] },
            { nome: "Petr - Milk Stout", prezzo: 8, descrizione:"Alc. <b>5,5%</b> - <b>50 cl</b>", immagine: "img/birre/petr.png", allergeni: [] },
        ]
    },
    {
        categoria: "Alcolici e cocktail",
        prodotti: [
            { nome: "Vino (bottiglia, calice)", prezzo: 3.5, descrizione: "scegli tu il tipo. <b><br>Il prezzo può variare</p></b>", immagine: "img/bevande/vino.png", allergeni: [] },
            { nome: "Aperol Spritz", prezzo: 4, immagine: "img/bevande/apespritz.png", allergeni: [] },
            { nome: "Campari Spritz", prezzo: 4, immagine: "img/bevande/camparispritz.png", allergeni: [] },
            { nome: "Negroni", prezzo: 4, immagine: "img/bevande/negroni.png", allergeni: [] },
            { nome: "Americano", prezzo: 4, immagine: "img/bevande/negroni.png", allergeni: [] },
            { nome: "Gin Tonic", prezzo: 5, descrizione: "scegli tu il Gin. <b><br>Il prezzo può variare</p></b>", immagine: "img/bevande/gintonic.png", allergeni: [] },
            { nome: "Vodka Tonic", prezzo: 4, immagine: "img/bevande/gintonic.png", allergeni: [] },
            { nome: "Sanbitter (corretto)", prezzo: 3, immagine: "img/bevande/bitter.png", allergeni: [] },
            { nome: "Crodino (corretto)", prezzo: 3, immagine: "img/bevande/crodinoo.png", allergeni: [] },
            { nome: "Campari Soda (corretto)", prezzo: 3.50, immagine: "img/bevande/campari.png", allergeni: [] },
        ]
    },
    {
        categoria: "Distillati e amari",
        prodotti: [
            { nome: "Amari", prezzo: 2.50, immagine: "img/distillati/amari.jpg", allergeni: [] },
            { nome: "Grappa Bianca", prezzo: 3, immagine: "img/distillati/grapp.jpg", allergeni: [] },
            { nome: "Grappa Barrique", prezzo: 3.50, immagine: "img/distillati/grapp.jpg", allergeni: [] },
            { nome: "Altri distillati Bianchi", prezzo: 3, immagine: "img/distillati/altrist.jpg", allergeni: [] },
            { nome: "Altri distillati Barrique", prezzo: 3.50, immagine: "img/distillati/altrist.jpg", allergeni: [] },
            { nome: "Shottini", prezzo: 2, immagine: "img/distillati/shot.jpg", allergeni: [] },
        ]
    },
    {
        categoria: "Antipasti",
        prodotti: [
            { nome: "Tagliere toscano", prezzo: 9, descrizione: "salumi, formaggi del territorio.", immagine: "img/taglieri/toscano.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Crostoni", prezzo: 6.50, descrizione: "scegli tu come farlo.", immagine: "img/taglieri/crostone.jpeg", allergeni: [] },
            { nome: "Crostini misti", prezzo: 6, descrizione: "variano in base al giorno.", immagine: "img/taglieri/crostini.jpg", allergeni: [] },
            { nome: "Caprese", prezzo: 6.50, descrizione: "pomodoro, mozzarella e basilico.", immagine: "img/taglieri/caprese.jpg", allergeni: ["latte"] },
            { nome: "Selezione di formaggi", prezzo: 8, descrizione: "selezione di formaggi del territorio.", immagine: "img/taglieri/formaggi.jpg", allergeni: ["latte"] }
        ]
    },
    {
        categoria: "Tegamini",
        prodotti: [
            { nome: "Classico", prezzo: 7.50, descrizione: "pomodoro, mozzarella, prosciutto cotto.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte"] },
            { nome: "Rustico", prezzo: 7.50, descrizione: "pomodoro, mozzarella, salsiccia, cipolla.", immagine: "img/tegamini/tegst.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Vegetariano", prezzo: 7.50, descrizione: "pomodoro, mozzarella, verdure.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte"] },
            { nome: "Altoatesino", prezzo: 7.50, descrizione: "pomodoro, mozzarella, speck, fontina.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte"] },
            { nome: "Fotonico", prezzo: 7.50, descrizione: "pomodoro, mozzarella, n'Duja.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte"] },
            { nome: "Puzzone", prezzo: 7.50, descrizione: "pomodoro, mozzarella, pecorino, gorgonzola, fontina.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte"] },
            { nome: "Autunnale", prezzo: 7.50, descrizione: "pomodoro, mozzarella, salsiccia, fagioli.", immagine: "img/tegamini/tegst.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Mitico", prezzo: 7.50, descrizione: "pomodoro, mozzarella, pecorino, radicchio, porro.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte"] },
            { nome: "Bismark", prezzo: 7.50, descrizione: "pomodoro, mozzarella, gorgonzola, salsiccia, uovo.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte", "uova"] },
            { nome: "Parmigiano", prezzo: 7.50, descrizione: "pomodoro, mozzarella, melanzane, parmigiano, origano.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte"] },
            { nome: "Montanaro", prezzo: 7.50, descrizione: "pomodoro, mozzarella, salsiccia, porcini.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte"] },
            { nome: "Lampredotto", prezzo: 7.50, descrizione: "pomodoro, mozzarella, lampredotto, funghi.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte"] },
            { nome: "Trippa alla fiorentina", prezzo: 7.50, descrizione: "pomodoro, mozzarella, trippa, cipolla, parmigiano.", immagine: "img/tegamini/tegst.jpg", allergeni: ["latte"] },
        ]
    },
    {
        categoria: "Pizze",
        prodotti: [
            { nome: "Personalizzata", prezzo: 6, descrizione: "scegli tu gli ingredienti. <b><br>Il prezzo può variare</p></b>", immagine: "img/pizze/pizzapers.png", allergeni: [] },
            { nome: "Margherita", prezzo: 6, descrizione: "pomodoro, mozzarella, basilico.", immagine: "img/pizze/marghe.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Marinara", prezzo: 6, descrizione: "pomodoro, aglio.", immagine: "img/pizze/marina.jpeg", allergeni: ["glutine"] },
            { nome: "Napoli", prezzo: 8, descrizione: "pomodoro, mozzarella, acciughe, capperi.", immagine: "img/pizze/napoli.jpg", allergeni: ["glutine", "latte", "pesce"] },
            { nome: "Prosciutto", prezzo: 7, descrizione: "pomodoro, mozzarella, prosciutto cotto.", immagine: "img/pizze/prosciutto.png", allergeni: ["glutine", "latte"] },
            { nome: "Wurstel", prezzo: 7.50, descrizione: "pomodoro, mozzarella, wurstel.", immagine: "img/pizze/wurstel.png", allergeni: ["glutine", "latte"] },
            { nome: "Salsiccia", prezzo: 7.50, descrizione: "pomodoro, mozzarella, salsiccia.", immagine: "img/pizze/salsiccia.jpeg", allergeni: ["glutine", "latte"] },
            { nome: "Prosciutto e funghi", prezzo: 8, descrizione: "pomodoro, mozzarella, prosciutto cotto, funghi.", immagine: "img/pizze/proscfunghi.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Salsiccia e cipolle", prezzo: 7.50, descrizione: "pomodoro, mozzarella, salsiccia, cipolla.", immagine: "img/pizze/salscip.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Quattro stagioni", prezzo: 8, descrizione: "pomodoro, mozzarella, olive, carciofi, funghi, prosciutto cotto.", immagine: "img/pizze/quattro.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Capricciosa", prezzo: 8, descrizione: "pomodoro, mozzarella, olive, carciofi, funghi, prosciutto cotto.", immagine: "img/pizze/quattro.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Salamino piccante", prezzo: 7.50, descrizione: "pomodoro, mozzarella, salamino piccante.", immagine: "img/pizze/salamino.jpg", allergeni: ["glutine", "latte", "piccante"] },
            { nome: "Gorgonzola e peperoncino", prezzo: 7.50, descrizione: "pomodoro, mozzarella, gorgonzola, peperoncino.", immagine: "img/pizze/gorgo.jpg", allergeni: ["glutine", "latte", "piccante"] },
            { nome: "Speck, Brie e porcini", prezzo: 9.00, descrizione: "pomodoro, mozzarella, speck, Brie, porcini.", immagine: "img/pizze/speckporc.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Vegetariana", prezzo: 8, descrizione: "pomodoro, mozzarella, verdure.", immagine: "img/pizze/veg.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Maialona", prezzo: 9, descrizione: "pomodoro, mozzarella, wurstel, salsiccia, salamino piccante, prosciutto cotto.", immagine: "img/pizze/maiala.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Autunnale", prezzo: 7.50, descrizione: "pomodoro, mozzarella, salsiccia, porri.", immagine: "img/pizze/autunnale.jpeg", allergeni: ["glutine", "latte"] },
            { nome: "Gustò", prezzo: 8, descrizione: "pomodoro, mozzarella, salsiccia, Brie.", immagine: "img/pizze/gusto.jpeg", allergeni: ["glutine", "latte"] },
            { nome: "Salsiccia e friarielli", prezzo: 8, descrizione: "pomodoro, mozzarella, salsiccia, friarielli.", immagine: "img/pizze/friarielli.jpeg", allergeni: ["glutine", "latte"] },
            { nome: "Sfiziosa", prezzo: 8.50, descrizione: "mozzarella, rucola, grana, speck.", immagine: "img/pizze/sfiziosa.jpeg", allergeni: ["glutine", "latte"] },
            { nome: "Porcini", prezzo: 9, descrizione: "pomodoro, mozzarella, porcini.", immagine: "img/pizze/funghi.jpeg", allergeni: ["glutine", "latte"] },
        ]
    },
    {
        categoria: "Pizze speciali",
        prodotti: [
            { nome: "Uno", prezzo: 9.50, descrizione: "varia in base al giorno.", immagine: "img/pizze/pizzaspec.png", allergeni: [] },
            { nome: "Due", prezzo: 9.50, descrizione: "varia in base al giorno.", immagine: "img/pizze/pizzaspec.png", allergeni: [] },
            { nome: "Tre", prezzo: 9.50, descrizione: "varia in base al giorno.", immagine: "img/pizze/pizzaspec.png", allergeni: [] },
            { nome: "Quattro", prezzo: 9.50, descrizione: "varia in base al giorno.", immagine: "img/pizze/pizzaspec.png", allergeni: [] },
        ]
    },
    {
        categoria: "Calzoni",
        prodotti: [
            { nome: "Personalizzato", prezzo: 8.50, descrizione: "scegli tu gli ingredienti. <b><br>Il prezzo può variare</p></b>", immagine: "img/calzoni/personalizzato.png", allergeni: [] },
            { nome: "Classico", prezzo: 8.50, descrizione: "pomodoro, mozzarella, prosciutto cotto.", immagine: "img/calzoni/classico.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Farcito", prezzo: 9, descrizione: "pomodoro, mozzarella, prosciutto cotto, funghi, salsiccia.", immagine: "img/calzoni/classico.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Calzino", prezzo: 9, descrizione: "mozzarella, salsiccia, porri.", immagine: "img/calzoni/classico.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Baciata", prezzo: 9, descrizione: "mozzarella, rucola, prosciutto crudo, funghi a lamella, pomodori secchi.", immagine: "img/calzoni/baciata.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Lampredotto", prezzo: 10, descrizione: "mozzarella, lampredotto, cipolla, funghi.", immagine: "img/calzoni/classico.jpg", allergeni: ["glutine", "latte"] },
        ]
    },
    {
        categoria: "Pucce e panini",
        prodotti: [
            { nome: "Piadine ripiene", prezzo: 3.50, immagine: "img/pucce/piad.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Hamburger", prezzo: 6, immagine: "img/pucce/paninost.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Hotdog", prezzo: 6, immagine: "img/pucce/paninost.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Puccia con salsiccia", prezzo: 6, immagine: "img/pucce/paninost.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Panino con lampredotto", prezzo: 6, immagine: "img/pucce/paninost.jpg", allergeni: ["glutine", "latte"] },
        ]
    },
    {
        categoria: "Dolci",
        prodotti: [
            { nome: "Paste", prezzo: 1.20, immagine: "img/dolci/paste.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Dolce monoporzione", prezzo: 4, immagine: "img/dolci/dolcist.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Crostata (al kg)", prezzo: 23, descrizione: "specifica la quantità nelle note", immagine: "img/dolci/crosta.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Torte (al kg)", prezzo: 24, descrizione: "specifica la quantità nelle note", immagine: "img/dolci/torta.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Pasticceria (al kg)", prezzo: 23, descrizione: "specifica la quantità nelle note", immagine: "img/dolci/pastic.jpg", allergeni: ["glutine", "latte"] },
            { nome: "Crepes alla nutella", prezzo: 3, immagine: "img/dolci/crepes.jpg", allergeni: ["glutine", "latte"] },
        ]
    },
];