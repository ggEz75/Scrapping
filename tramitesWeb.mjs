import puppeteer from 'puppeteer';
import xlsx from 'xlsx';

async function handleDynamicWebPage() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50
    });

    const pages = [
        { label: 'Salud', url: 'https://ciudaddecorrientes.gov.ar/tramites/salud' },
        { label: 'Tramites No Municipales', url: 'https://ciudaddecorrientes.gov.ar/tramites/tramites-no-municipales' },
        { label: 'ESCRIBANíA MUNICIPAL', url: 'https://ciudaddecorrientes.gov.ar/tramites/escriban-municipal' },
        { label: 'SUBE', url: 'https://ciudaddecorrientes.gov.ar/tramites/sube' },
        { label: 'LIMPIEZA URBANA', url: 'https://ciudaddecorrientes.gov.ar/tramites/limpieza-urbana' },
        { label: 'CEMENTERIOS', url: 'https://ciudaddecorrientes.gov.ar/tramites/cementerios' },
        { label: 'POLITICAS SOCIALES', url: 'https://ciudaddecorrientes.gov.ar/tramites/politicas-sociales' },
        { label: 'RESIDUOS PELIGROSOS Y TóXICOS', url: 'https://ciudaddecorrientes.gov.ar/tramites/residuos-peligrosos-y-t-xicos' },
        { label: 'ESPACIOS PUBLICOS', url: 'https://ciudaddecorrientes.gov.ar/tramites/espacios-publicos' },
        { label: 'OBRAS PUBLICAS', url: 'https://ciudaddecorrientes.gov.ar/tramites/obras-publicas' },
        { label: 'RECLAMO / DENUNCIA', url: 'https://ciudaddecorrientes.gov.ar/tramites/reclamo-denuncia' },
        { label: 'ESPACIOS CULTURALES', url: 'https://ciudaddecorrientes.gov.ar/tramites/espacios-culturales' },
        { label: 'ATENCION CIUDADANA', url: 'https://ciudaddecorrientes.gov.ar/tramites/atencion-ciudadana' },
        { label: 'PUNTO DIGITAL', url: 'https://ciudaddecorrientes.gov.ar/tramites/punto-digital' },
        { label: 'INMUEBLES', url: 'https://ciudaddecorrientes.gov.ar/tramites/inmuebles' },
        { label: 'USO DE SUELO', url: 'https://ciudaddecorrientes.gov.ar/tramites/uso-de-suelo' },
        { label: 'PRODUCTOS ALIMENTICIOS', url: 'https://ciudaddecorrientes.gov.ar/tramites/productos-alimenticios' },
        { label: 'ARBOLADO URBANO', url: 'https://ciudaddecorrientes.gov.ar/tramites/arbolado-urbano' },
        { label: 'ESPECTáCULOS PúBLICOS', url: 'https://ciudaddecorrientes.gov.ar/tramites/espect-culos-p-blicos' },
        { label: 'INSPECCIONES DE OBRAS', url: 'https://ciudaddecorrientes.gov.ar/tramites/inspecciones-de-obras' },
        { label: 'TURISMO', url: 'https://ciudaddecorrientes.gov.ar/tramites/turismo' },
        { label: 'TRáMITES PARA PERSONAS CON DISCAPACIDAD', url: 'https://ciudaddecorrientes.gov.ar/tramites/tramites-para-personas-con-discapacidad' },
        { label: 'CAJA MUNICIPAL DE PRESTAMOS', url: 'https://ciudaddecorrientes.gov.ar/tramites/caja-municipal-de-prestamos' },
        { label: 'PYMES Y EMPRENDEDORES', url: 'https://ciudaddecorrientes.gov.ar/tramites/pymes-y-emprendedores' },
        { label: 'AUTOMOTOR', url: 'https://ciudaddecorrientes.gov.ar/tramites/automotor' },
        { label: 'DESARROLLO ECONOMICO', url: 'https://ciudaddecorrientes.gov.ar/tramites/desarrollo-economico' },
        { label: 'LICENCIA DE CONDUCIR', url: 'https://ciudaddecorrientes.gov.ar/tramites/licencia-de-conducir' },
        { label: 'HABILITACIONES Y PERMISOS', url: 'https://ciudaddecorrientes.gov.ar/tramites/habilitaciones-y-permisos' },
        { label: 'TASAS COMERCIALES', url: 'https://ciudaddecorrientes.gov.ar/tramites/tasas-comerciales' },
        { label: 'BROMATOLOGIA', url: 'https://ciudaddecorrientes.gov.ar/tramites/bromatologia' },
        { label: 'TRANSPORTE', url: 'https://ciudaddecorrientes.gov.ar/tramites/transporte' },
        { label: 'ESPACIOS VERDES', url: 'https://ciudaddecorrientes.gov.ar/tramites/espacios-verdes' },
        { label: 'CATASTRO', url: 'https://ciudaddecorrientes.gov.ar/tramites/catastro' },
        { label: 'CULTURA', url: 'https://ciudaddecorrientes.gov.ar/tramites/cultura' },
        { label: 'ESTACIONAMIENTO MEDIDO', url: 'https://ciudaddecorrientes.gov.ar/tramites/estacionamiento-medido' },
        { label: 'INFRACCIONES', url: 'https://ciudaddecorrientes.gov.ar/tramites/infracciones' },
        { label: 'OBRAS PARTICULARES', url: 'https://ciudaddecorrientes.gov.ar/tramites/obras-particulares' },
        { label: 'REGISTRO DE PROVEEDORES', url: 'https://ciudaddecorrientes.gov.ar/tramites/registro-de-proveedores' },
        { label: 'RENTAS', url: 'https://ciudaddecorrientes.gov.ar/tramites/rentas' },
        { label: 'TRANSITO', url: 'https://ciudaddecorrientes.gov.ar/tramites/transito' }
    ];

    try {
        let allResults = [];

        for (const pageData of pages) {
            const page = await browser.newPage();
            await page.goto(pageData.url, { waitUntil: 'networkidle0', timeout: 0 });

            let continueScraping = true;
            let pageResults = [];

            do {
                await page.waitForSelector('.tramites-por-categoria', { timeout: 10000 });

                const newPageResults = await page.evaluate((pageData) => { // Pasar pageData como argumento
                    const tramites = document.querySelectorAll('.col-md-12');
                    return [...tramites].map(tramite => {
                        const items = [...tramite.querySelectorAll('.tramites-por-categoria')].map(item => item.innerText);
                        const linkElement = tramite.querySelector('a');
                        const link = linkElement ? linkElement.href : 'No link found';
                        return { categoria: pageData.label, items: items.join(", "), link };
                    }).filter(result => result.items !== '' && result.link !== 'No link found');
                }, pageData); // Pasar pageData como argumento

                pageResults = pageResults.concat(newPageResults);

                const nextPageButton = await page.$('a[title="Ir a la página siguiente"]');
                if (nextPageButton) {
                    await nextPageButton.click();
                    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 });
                } else {
                    continueScraping = false;
                }
            } while (continueScraping);

            allResults = allResults.concat(pageResults);

            await page.close();
        }

        await browser.close();

        // Guardar los resultados en un archivo Excel
        const worksheet = xlsx.utils.json_to_sheet(allResults);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Resultados");
        xlsx.writeFile(workbook, "Resultados.xlsx");
        console.log("Datos guardados en Excel.");

    } catch (error) {
        console.error('Error durante la extracción y navegación de datos:', error);
        await browser.close();
    }
}

handleDynamicWebPage();




