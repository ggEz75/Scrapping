
import puppeteer from 'puppeteer';
import xlsx from 'xlsx';

async function handleDynamicWebPage(){

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100
    })

    const page = await browser.newPage()
    await page.goto('https://ciudaddecorrientes.gov.ar/tramites') 

    try{ 
    const result = await page.evaluate(() => {

        const tramites = document.querySelectorAll('.list-categories')
        const data = [...tramites].map(tramite => {
            const tramiteItem = tramite.querySelector('h2').innerText
            const tramiteLink = tramite.querySelector('a');
            const url = tramiteLink ? tramiteLink.href : 'NO LINK';

            return { tramiteItem, url};
            
        })
        return data
    });
    console.log(result)

    await browser.close()


    const hojaExcel = xlsx.utils.json_to_sheet(result)
    const libroExcel = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(libroExcel,hojaExcel,"Categorias")
    xlsx.writeFile(libroExcel,"Categorias.xlsx")
    console.log("Datos guardados en Excel: Categorias.xlsx")

} catch (error){

    console.log('Error en la pagina...');
    await browser.close();
    }
}

handleDynamicWebPage();
