export interface PriceOption {
  etiqueta: string; // e.g. "Plato", "Fuente", "Porción"
  precio: string;   // e.g. "S/.30.00"
}

export interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
  opcionesPrecio?: PriceOption[];
}

export interface Category {
  id: string;
  nombre: string;
  items: Dish[];
}

/**
 * Función auxiliar para parsear strings como "Plato: S/.30.00 | Fuente: S/.70.00" o "Plato: S/.25.00-S/.30.00 | Fuente: S/.60.00-S/.70.00"
 */
export function parsePriceOptions(precioStr: string): PriceOption[] {
  if (!precioStr || !precioStr.includes('|')) return [];
  
  const partes = precioStr.split('|').map(p => p.trim());
  const opciones: PriceOption[] = [];
  
  for (const parte of partes) {
    const match = parte.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      opciones.push({
        etiqueta: match[1].trim(),
        precio: match[2].trim()
      });
    }
  }
  
  return opciones;
}

/**
 * Obtiene el precio mínimo para mostrar como "Desde S/.XX"
 */
export function getDisplayPrice(precioStr: string): { texto: string; esMultiple: boolean } {
  if (!precioStr) return { texto: '', esMultiple: false };
  
  const opciones = parsePriceOptions(precioStr);
  if (opciones.length > 0) {
    // Buscar el primer valor numérico menor en las opciones
    let minVal = Infinity;
    let minText = '';
    
    for (const opt of opciones) {
      // Extraer números, p.ej "S/.25.00-S/.30.00" -> "25.00"
      const matches = opt.precio.match(/\d+(\.\d+)?/g);
      if (matches) {
        for (const m of matches) {
          const val = parseFloat(m);
          if (val < minVal) {
            minVal = val;
            minText = `S/.${val.toFixed(2)}`;
          }
        }
      }
    }
    
    if (minVal !== Infinity) {
      return { texto: `Desde ${minText}`, esMultiple: true };
    }
  }
  
  // Si no tiene '|' pero tiene un rango como "S/.25.00-S/.30.00"
  const matches = precioStr.match(/\d+(\.\d+)?/g);
  if (precioStr.includes('-') && matches && matches.length > 0) {
    const minVal = Math.min(...matches.map(m => parseFloat(m)));
    return { texto: `Desde S/.${minVal.toFixed(2)}`, esMultiple: true };
  }
  
  return { texto: precioStr, esMultiple: false };
}

export const DEFAULT_MENU_DATA: Category[] = [
  {
    id: "especialidades-destacadas",
    nombre: "Especialidades destacadas",
    items: [
      {
        nombre: "Ciño al ajo",
        descripcion: "Preparación de ciño al ajo presentada con arroz, yuca frita, limón y salsa criolla. Una propuesta de sabor y tradición con un toque de picante.",
        precio: "S/. 30.00",
        imagen: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80"
      },
      {
        nombre: "Ceviche de cangrejo",
        descripcion: "Ceviche preparado con cangrejo fresco y acompañado de choclo, lechuga, cebolla y complementos marinos. Una experiencia de tres delicias.",
        precio: "Plato: S/.30.00 | Fuente: S/.70.00",
        imagen: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80"
      },
      {
        nombre: "Leche de tigre",
        descripcion: "Copa de leche de tigre concentrada acompañada de langostino, mejillón, limón, chifle y cancha. El poder del mar en cada sorbo.",
        precio: "S/. 18.00",
        imagen: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "ceviches",
    nombre: "Ceviches",
    items: [
      {
        nombre: "Ceviche mixto o de pescado",
        descripcion: "Ceviche tradicional peruano disponible en versión mixta con mariscos o únicamente pescado fresco del día.",
        precio: "Plato: S/.25.00-S/.30.00 | Fuente: S/.60.00-S/.70.00",
        imagen: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=600&q=80"
      },
      {
        nombre: "Ceviche de chanque",
        descripcion: "Ceviche preparado con fresco y suave chanque. Disponible en presentación de plato y fuente familiar.",
        precio: "Plato: S/.30.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Ceviche de pulpo",
        descripcion: "Láminas de pulpo fresco marinado en jugo de limón peruano, ají limo y especias de la casa.",
        precio: "Plato: S/.30.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Ceviche de langostino",
        descripcion: "Jugosos langostinos curtidos en su punto exacto con rocoto, cebolla morada y canchita serrana.",
        precio: "Plato: S/.35.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Ceviche mixto con chanque",
        descripcion: "Combinación marina perfecta de mariscos variados complementada con delicioso chanque.",
        precio: "Plato: S/.30.00 | Fuente: S/.60.00-S/.70.00"
      },
      {
        nombre: "Ceviche norteño clásico",
        descripcion: "Ceviche preparado al estilo tradicional del norte con el toque auténtico de sazón regional.",
        precio: "Plato: S/.25.00-S/.30.00 | Fuente: S/.60.00-S/.70.00"
      }
    ]
  },
  {
    id: "especialidades-de-la-casa",
    nombre: "Especialidades de la casa",
    items: [
      {
        nombre: "Ceviche de cangrejo vivo o precocido",
        descripcion: "Ceviche insigne de la casa disponible a preferencia con cangrejo vivo o previamente cocido.",
        precio: "Plato: S/.30.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Langostinos a la olla",
        descripcion: "Langostinos enteros preparados a la olla con la sazón y secreta receta marinera D'ANDRY.",
        precio: "Plato: S/.35.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Picante de ciño",
        descripcion: "Plato criollo marino con guiso concentrado de ciño en crema de ajíes y papas.",
        precio: "Plato: S/.30.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Cangrejo reventado",
        descripcion: "Preparación especial de cangrejo reventado salteado con condimentos costeños y hierbas.",
        precio: "Plato: S/.30.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Picante de pulpo",
        descripcion: "Trozos suaves de pulpo en suculento guiso picante de la casa servido con arroz blanco.",
        precio: "Plato: S/.30.00 | Fuente: S/.70.00"
      }
    ]
  },
  {
    id: "arroces",
    nombre: "Arroces",
    items: [
      {
        nombre: "Arroz con mariscos",
        descripcion: "Arroz graneado y ajiotado con pulpo, langostinos, calamar y la sazón marina emblemática.",
        precio: "Plato: S/.30.00 | Fuente: S/.60.00-S/.70.00",
        imagen: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80"
      },
      {
        nombre: "Arroz con langostinos",
        descripcion: "Exquisito arroz salteado cargado de selectos y gigantes langostinos al wok.",
        precio: "Plato: S/.35.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Chaufa de pescado",
        descripcion: "Arroz chaufa peruano-oriental al wok con dados crocantes de pescado frito y cebollita china.",
        precio: "Plato: S/.30.00 | Fuente: S/.60.00-S/.70.00"
      },
      {
        nombre: "Chaufa de langostinos",
        descripcion: "Chaufa al wok salteado a fuego vivo con langostinos y tortilla de huevo.",
        precio: "Plato: S/.35.00 | Fuente: S/.70.00"
      }
    ]
  },
  {
    id: "frituras",
    nombre: "Frituras",
    items: [
      {
        nombre: "Chicharrón mixto o de pescado",
        descripcion: "Fritura super crocante servida con yuca frita, cancha dorada y tártara marina.",
        precio: "Plato: S/.25.00-S/.30.00 | Fuente: S/.60.00-S/.70.00"
      },
      {
        nombre: "Chicharrón de langostinos",
        descripcion: "Langostinos empanizados fritos a la perfección dorada y crujiente.",
        precio: "Plato: S/.35.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Chicharrón de pota",
        descripcion: "Anillas de pota crocantes acompañadas de salsa criolla y yucas.",
        precio: "Plato: S/.25.00 | Fuente: S/.50.00"
      },
      {
        nombre: "Jalea de pescado del día",
        descripcion: "Gran mixtura de fritos marinos coronados con salsa criolla picadita.",
        precio: "S/. 35.00"
      },
      {
        nombre: "Chicharrón de calamar",
        descripcion: "Roscas de calamar dorado en apanado especial con cremosa salsa de la casa.",
        precio: "S/. 30.00"
      }
    ]
  },
  {
    id: "jugosos-y-parihuela",
    nombre: "Jugosos y parihuela",
    items: [
      {
        nombre: "Jugoso de congrio",
        descripcion: "Sustancioso jugoso concentrado de congrio a base de tomate, ajíes y chicha de jora.",
        precio: "Plato: S/.30.00 | Fuente: S/.60.00-S/.70.00"
      },
      {
        nombre: "Jugoso de chita",
        descripcion: "Pescado chita entero en jugosa salsa marina con yuca y arroz blanco.",
        precio: "Plato: S/.30.00 | Fuente: S/.60.00"
      },
      {
        nombre: "Jugoso de cabrilla",
        descripcion: "Cabrilla fresca guisada en jugo concentrado picantito y aromático.",
        precio: "Plato: S/.35.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Jugoso de cangrejo",
        descripcion: "Cangrejo entero en caldo reconfortante y jugoso con hierba buena y ají espeso.",
        precio: "Plato: S/.30.00 | Fuente: S/.60.00"
      },
      {
        nombre: "Parihuela con pesca del día",
        descripcion: "Potente caldo levanta muertos con variados frutos del mar y pesca fresca.",
        precio: "S/. 35.00"
      }
    ]
  },
  {
    id: "duos",
    nombre: "Dúos",
    items: [
      {
        nombre: "Ceviche mixto + chicharrón mixto",
        descripcion: "La combinación perfecta entre lo fresco del ceviche y lo crujiente del chicharrón.",
        precio: "Plato: S/.30.00 | Fuente: S/.60.00-S/.70.00"
      },
      {
        nombre: "Ceviche mixto + ceviche de cangrejo",
        descripcion: "Dúo doblemente refrescante para los amantes del buen ceviche marisquero.",
        precio: "Plato: S/.30.00 | Fuente: S/.60.00-S/.70.00"
      },
      {
        nombre: "Ceviche mixto + chicharrón de pota",
        descripcion: "Excelente dúo económico cargado de sabor marino e intensidad.",
        precio: "Plato: S/.20.00 | Fuente: S/.50.00"
      },
      {
        nombre: "Ceviche mixto + arroz con mariscos",
        descripcion: "El clásico combo marino que nunca falla en tu mesa.",
        precio: "Plato: S/.30.00 | Fuente: S/.60.00-S/.70.00"
      },
      {
        nombre: "Chicharrón mixto + ceviche de cangrejo",
        descripcion: "Chicharrón crujiente contrastado con la frescura única del ceviche de cangrejo.",
        precio: "Plato: S/.30.00 | Fuente: S/.60.00-S/.70.00"
      }
    ]
  },
  {
    id: "trios",
    nombre: "Tríos",
    items: [
      {
        nombre: "Ceviche + chicharrón + arroz con mariscos",
        descripcion: "La trilogía sagrada de la gastronomía marina peruana en una sola presentación.",
        precio: "Plato: S/.35.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Ceviche + chicharrón + ceviche de cangrejo",
        descripcion: "Trío variado con la sazón estelar de cangrejo de la casa D'ANDRY.",
        precio: "Plato: S/.35.00 | Fuente: S/.70.00"
      },
      {
        nombre: "Chicharrón + arroz con mariscos + ceviche de cangrejo",
        descripcion: "Festín completo para disfrutar de todos los sabores marinos intensos.",
        precio: "Plato: S/.40.00 | Fuente: S/.80.00"
      }
    ]
  },
  {
    id: "bebidas-gaseosas",
    nombre: "Bebidas gaseosas",
    items: [
      { nombre: "Inca Kola 1 litro", descripcion: "Botella de Inca Kola de 1L heladita.", precio: "S/.9.00" },
      { nombre: "Coca-Cola 1 litro", descripcion: "Botella de Coca-Cola de 1L.", precio: "S/.9.00" },
      { nombre: "Gordita 1/2 litro", descripcion: "Bebida gaseosa personal gordita 500ml.", precio: "S/.5.00" },
      { nombre: "Coca-Cola 1/2 litro", descripcion: "Botella de Coca-Cola 500ml.", precio: "S/.4.50" },
      { nombre: "Inca Kola 1/2 litro", descripcion: "Botella de Inca Kola 500ml.", precio: "S/.4.50" },
      { nombre: "Coca-Cola 2 litros", descripcion: "Botella familiar Coca-Cola 2L.", precio: "S/.13.00" },
      { nombre: "Inca Kola 2 litros", descripcion: "Botella familiar Inca Kola 2L.", precio: "S/.13.00" },
      { nombre: "Coca-Cola 3 litros", descripcion: "Botella gigante Coca-Cola 3L.", precio: "S/.16.00" },
      { nombre: "Inca Kola 3 litros", descripcion: "Botella gigante Inca Kola 3L.", precio: "S/.16.00" },
      { nombre: "Agua mineral con gas o sin gas", descripcion: "Botella de agua mineral 500ml.", precio: "S/.2.00" }
    ]
  },
  {
    id: "cervezas",
    nombre: "Cervezas",
    items: [
      { nombre: "Pilsen Callao", descripcion: "Cerveza Pilsen helada en botella personal.", precio: "S/.8.00" },
      { nombre: "Cusqueña de Trigo", descripcion: "Cerveza Cusqueña Trigo 310ml.", precio: "S/.10.00" },
      { nombre: "Cusqueña Negra", descripcion: "Cerveza Cusqueña Negra 310ml.", precio: "S/.10.00" }
    ]
  },
  {
    id: "refrescos",
    nombre: "Refrescos",
    items: [
      { nombre: "Limonada 1 litro", descripcion: "Jarra natural de 1L de limonada recién hecha.", precio: "S/.12.00" },
      { nombre: "Maracuyá 1 litro", descripcion: "Jarra concentrada de 1L de pura maracuyá.", precio: "S/.12.00" },
      { nombre: "Chicha Morada 1 litro", descripcion: "Jarra de 1L de chicha morada tradicional.", precio: "S/.12.00" },
      { nombre: "Frozen de limón 1 litro", descripcion: "Jarra frappe heladísima de frozen de limón.", precio: "S/.15.00" },
      { nombre: "Frozen de maracuyá 1 litro", descripcion: "Jarra frappe de maracuyá granizado refrescante.", precio: "S/.15.00" }
    ]
  },
  {
    id: "adicionales",
    nombre: "Adicionales",
    items: [
      { nombre: "Porción de arroz", descripcion: "Porción extra de arroz blanco graneado.", precio: "S/.4.00" },
      { nombre: "Porción de cancha", descripcion: "Canchita serrana tostada y saladita.", precio: "S/.4.00" },
      { nombre: "Yuca frita", descripcion: "Porción de crocantes yucas fritas doradas.", precio: "S/.8.00" },
      { nombre: "Camote frito", descripcion: "Porción de camotes fritos crujientes.", precio: "S/.8.00" },
      { nombre: "Choclo desgranado", descripcion: "Porción adicional de choclo tierno.", precio: "S/.4.00" },
      { nombre: "Camote sancochado", descripcion: "Porción dulce de camote sancochado.", precio: "S/.4.00" },
      { nombre: "Yuca sancochada", descripcion: "Porción suave de yuca sancochada.", precio: "S/.4.00" }
    ]
  }
];
