'use client'
import { useState, useMemo } from "react"


const D = [
  {n:"Andres Felipe Arias",t:"A",s:87.9,m:641,l:85,w:11.5,ad:41,aw:9,la:"2026-02-21",di:0,vs:30,cs:12.9,ss:20,rs:25},
  {n:"Camilo Gomez",t:"A",s:86.5,m:153,l:30,w:22.9,ad:32,aw:8,la:"2026-02-18",di:2,vs:30,cs:11.5,ss:20,rs:25},
  {n:"Fede Suarez",t:"A",s:86.5,m:185,l:17,w:32.0,ad:32,aw:8,la:"2026-02-21",di:0,vs:30,cs:11.5,ss:20,rs:25},
  {n:"Lucas Jaramillo",t:"A",s:86.5,m:205,l:33,w:16.5,ad:38,aw:8,la:"2026-02-21",di:0,vs:30,cs:11.5,ss:20,rs:25},
  {n:"Nico Fernandez",t:"A",s:86.5,m:160,l:25,w:21.2,ad:36,aw:8,la:"2026-02-20",di:1,vs:30,cs:11.5,ss:20,rs:25},
  {n:"Gabriel Bedoya",t:"A",s:86.5,m:133,l:8,w:23.4,ad:33,aw:8,la:"2026-02-21",di:0,vs:30,cs:11.5,ss:20,rs:25},
  {n:"Camilo Botero",t:"A",s:86.5,m:130,l:11,w:18.3,ad:33,aw:8,la:"2026-02-21",di:0,vs:30,cs:11.5,ss:20,rs:25},
  {n:"Hernán Jaramillo",t:"A",s:86.5,m:1476,l:510,w:18.8,ad:40,aw:8,la:"2026-02-21",di:0,vs:30,cs:11.5,ss:20,rs:25,u:true},
  {n:"Dario Palacio",t:"A",s:85.0,m:213,l:59,w:7.5,ad:38,aw:7,la:"2026-02-21",di:0,vs:30,cs:10.0,ss:20,rs:25},
  {n:"Nathanel Serebrenik",t:"A",s:85.0,m:157,l:38,w:11.5,ad:32,aw:7,la:"2026-02-21",di:0,vs:30,cs:10.0,ss:20,rs:25},
  {n:"gordo Barato",t:"A",s:85.0,m:318,l:135,w:8.4,ad:35,aw:7,la:"2026-02-21",di:0,vs:30,cs:10.0,ss:20,rs:25},
  {n:"Guillermo Valencia",t:"A",s:84.6,m:98,l:11,w:18.8,ad:28,aw:8,la:"2026-02-19",di:1,vs:28.1,cs:11.5,ss:20,rs:25},
  {n:"antonio jaller",t:"A",s:77.1,m:77,l:9,w:11.3,ad:28,aw:7,la:"2026-02-20",di:1,vs:22.1,cs:10.0,ss:20,rs:25},
  {n:"Juan Diego Pipo",t:"A",s:77.1,m:77,l:13,w:10.9,ad:27,aw:7,la:"2026-02-21",di:0,vs:22.1,cs:10.0,ss:20,rs:25},
  {n:"Daniel Bermúdez",t:"A",s:73.7,m:65,l:13,w:77.5,ad:21,aw:7,la:"2026-02-18",di:2,vs:18.6,cs:10.0,ss:20,rs:25},
  {n:"Juan Esteban Sanin",t:"A",s:71.7,m:73,l:7,w:21.4,ad:17,aw:4,la:"2026-02-20",di:1,vs:20.9,cs:5.7,ss:20,rs:25},
  {n:"Misas",t:"A",s:68.2,m:51,l:24,w:12.8,ad:23,aw:6,la:"2026-02-19",di:1,vs:14.6,cs:8.6,ss:20,rs:25},
  {n:"Enrique Uribe",t:"A",s:68.0,m:45,l:11,w:17.7,ad:23,aw:7,la:"2026-02-19",di:1,vs:12.9,cs:10.0,ss:20,rs:25},
  {n:"Pablo Velez Mejia",t:"A",s:67.7,m:39,l:3,w:17.6,ad:21,aw:8,la:"2026-02-20",di:1,vs:11.2,cs:11.5,ss:20,rs:25},
  {n:"Andred Angel",t:"A",s:67.7,m:49,l:3,w:27.9,ad:19,aw:6,la:"2026-02-20",di:1,vs:14.1,cs:8.6,ss:20,rs:25},
  {n:"Jon Oleaga",t:"A",s:67.4,m:48,l:1,w:27.6,ad:14,aw:6,la:"2026-02-18",di:2,vs:13.8,cs:8.6,ss:20,rs:25},
  {n:"Hector Casado",t:"A",s:66.2,m:44,l:10,w:11.2,ad:18,aw:6,la:"2026-02-17",di:3,vs:12.6,cs:8.6,ss:20,rs:25},
  {n:"Camilo Ospina Lumm",t:"A",s:65.7,m:47,l:5,w:17.7,ad:15,aw:5,la:"2026-02-20",di:1,vs:13.5,cs:7.2,ss:20,rs:25},
  {n:"paul gomez",t:"A",s:61.6,m:33,l:6,w:33.7,ad:7,aw:5,la:"2026-02-18",di:2,vs:9.5,cs:7.2,ss:20,rs:25},
  {n:"Juan Castilla",t:"A",s:59.9,m:22,l:3,w:18.0,ad:9,aw:6,la:"2026-02-20",di:1,vs:6.3,cs:8.6,ss:20,rs:25},
  {n:"Simón Restrepo",t:"A",s:59.6,m:21,l:4,w:60.6,ad:10,aw:6,la:"2026-02-13",di:7,vs:6.0,cs:8.6,ss:20,rs:25},
  {n:"Sebastian Piedrahita",t:"A",s:59.3,m:20,l:5,w:10.6,ad:13,aw:6,la:"2026-02-20",di:1,vs:5.7,cs:8.6,ss:20,rs:25},
  {n:"Juan Pablo González S.",t:"A",s:57.9,m:15,l:7,w:10.6,ad:11,aw:6,la:"2026-02-17",di:3,vs:4.3,cs:8.6,ss:20,rs:25},
  {n:"Paula Jaramillo",t:"A",s:57.9,m:20,l:2,w:17.1,ad:8,aw:5,la:"2026-02-17",di:3,vs:5.7,cs:7.2,ss:20,rs:25},
  {n:"Diego Sanchez",t:"A",s:57.6,m:14,l:4,w:23.6,ad:7,aw:6,la:"2026-02-20",di:1,vs:4.0,cs:8.6,ss:20,rs:25},
  {n:"Simon Jaramillo Alpha",t:"A",s:57.6,m:14,l:0,w:20.4,ad:9,aw:6,la:"2026-02-20",di:1,vs:4.0,cs:8.6,ss:20,rs:25},
  {n:"Valentina Ramírez",t:"A",s:57.6,m:29,l:3,w:16.6,ad:10,aw:3,la:"2026-02-20",di:1,vs:8.3,cs:4.3,ss:20,rs:25},
  {n:"Peter Alexander",t:"A",s:56.8,m:16,l:5,w:39.5,ad:8,aw:5,la:"2026-02-19",di:1,vs:4.6,cs:7.2,ss:20,rs:25},
  {n:"Felipe Medina",t:"A",s:55.8,m:16,l:3,w:10.2,ad:12,aw:7,la:"2026-02-18",di:2,vs:4.6,cs:10.0,ss:16.2,rs:25},
  {n:"Rodrigo Londoño",t:"A",s:55.6,m:17,l:4,w:15.8,ad:8,aw:4,la:"2026-02-20",di:1,vs:4.9,cs:5.7,ss:20,rs:25},
  {n:"Juancho Palacio",t:"A",s:55.0,m:7,l:2,w:15.4,ad:6,aw:6,la:"2026-02-13",di:7,vs:2.0,cs:8.6,ss:19.4,rs:25},
  {n:"Daniel Mesa",t:"A",s:55.0,m:20,l:6,w:23.1,ad:5,aw:3,la:"2026-02-18",di:2,vs:5.7,cs:4.3,ss:20,rs:25},
  {n:"Carlos Tobon",t:"A",s:54.2,m:12,l:4,w:13.6,ad:9,aw:4,la:"2026-02-15",di:5,vs:3.4,cs:5.7,ss:20,rs:25},
  {n:"Felipe Valencia",t:"A",s:53.9,m:11,l:3,w:16.8,ad:6,aw:4,la:"2026-02-20",di:1,vs:3.2,cs:5.7,ss:20,rs:25},
  {n:"Andres Palacio",t:"A",s:53.2,m:21,l:6,w:8.5,ad:10,aw:5,la:"2026-02-10",di:10,vs:6.0,cs:7.2,ss:20,rs:20},
  {n:"Lucas Echavarria",t:"A",s:52.2,m:12,l:2,w:15.4,ad:5,aw:3,la:"2026-02-21",di:0,vs:3.4,cs:4.3,ss:19.4,rs:25},
  {n:"Ricky Uribe",t:"A",s:51.8,m:27,l:4,w:8.9,ad:10,aw:5,la:"2026-02-11",di:9,vs:7.7,cs:7.2,ss:16.9,rs:20},
  {n:"Eulalia Sanín",t:"A",s:51.6,m:23,l:0,w:11.4,ad:10,aw:6,la:"2026-02-16",di:4,vs:6.6,cs:8.6,ss:11.4,rs:25},
  {n:"Nicolas Pelaez",t:"A",s:51.1,m:36,l:0,w:7.1,ad:17,aw:6,la:"2026-02-19",di:1,vs:10.3,cs:8.6,ss:7.1,rs:25},
  {n:"Rafael Troconis",t:"A",s:51.0,m:11,l:0,w:49.2,ad:5,aw:2,la:"2026-02-18",di:2,vs:3.2,cs:2.9,ss:20,rs:25},
  {n:"Luis Espinoza",t:"A",s:50.8,m:5,l:3,w:12.6,ad:5,aw:4,la:"2026-02-15",di:5,vs:1.4,cs:5.7,ss:18.6,rs:25},
  {n:"Carlos Henao",t:"A",s:50.2,m:3,l:0,w:24.7,ad:3,aw:3,la:"2026-02-18",di:2,vs:0.9,cs:4.3,ss:20,rs:25},
  {n:"German Corredor",t:"A",s:49.8,m:7,l:0,w:15.6,ad:7,aw:5,la:"2026-02-18",di:2,vs:2.0,cs:7.2,ss:15.6,rs:25},
  {n:"Nico Zapata (Taurus)",t:"A",s:49.0,m:4,l:1,w:32.2,ad:3,aw:2,la:"2026-02-20",di:1,vs:1.1,cs:2.9,ss:20,rs:25},
  {n:"Romano Arango",t:"A",s:48.8,m:21,l:3,w:4.6,ad:13,aw:5,la:"2026-02-18",di:2,vs:6.0,cs:7.2,ss:10.6,rs:25},
  {n:"Andrea Arango",t:"A",s:48.7,m:12,l:0,w:14.5,ad:6,aw:4,la:"2026-02-18",di:2,vs:3.4,cs:5.7,ss:14.5,rs:25},
  {n:"Mauricio Uribe",t:"A",s:48.2,m:6,l:0,w:29.2,ad:1,aw:1,la:"2026-02-20",di:1,vs:1.7,cs:1.4,ss:20,rs:25},
  {n:"Molo Villa",t:"A",s:47.6,m:4,l:0,w:39.5,ad:1,aw:1,la:"2026-02-18",di:2,vs:1.1,cs:1.4,ss:20,rs:25},
  {n:"Monica Arango",t:"A",s:46.3,m:12,l:0,w:10.7,ad:9,aw:5,la:"2026-02-20",di:1,vs:3.4,cs:7.2,ss:10.7,rs:25},
  {n:"Antonio Linares",t:"A",s:45.8,m:10,l:0,w:9.3,ad:8,aw:6,la:"2026-02-19",di:1,vs:2.9,cs:8.6,ss:9.3,rs:25},
  {n:"Maria Rios",t:"A",s:44.9,m:15,l:0,w:8.5,ad:9,aw:5,la:"2026-02-20",di:1,vs:4.3,cs:7.2,ss:8.5,rs:25},
  {n:"Sergio Gonzalez",t:"A",s:44.7,m:3,l:2,w:12.0,ad:2,aw:2,la:"2026-02-16",di:4,vs:0.9,cs:2.9,ss:16.0,rs:25},
  {n:"Gustavo Villa",t:"A",s:44.6,m:11,l:0,w:12.2,ad:4,aw:3,la:"2026-02-20",di:1,vs:3.2,cs:4.3,ss:12.2,rs:25},
  {n:"Gabby Grinberg",t:"A",s:44.4,m:2,l:0,w:16.0,ad:2,aw:2,la:"2026-02-16",di:4,vs:0.6,cs:2.9,ss:16.0,rs:25},
  {n:"Ricardo Sierra",t:"A",s:43.7,m:1,l:0,w:17.0,ad:1,aw:1,la:"2026-02-19",di:1,vs:0.3,cs:1.4,ss:17.0,rs:25},
  {n:"Checho Barth",t:"A",s:43.6,m:16,l:0,w:6.8,ad:10,aw:5,la:"2026-02-19",di:1,vs:4.6,cs:7.2,ss:6.8,rs:25},
  {n:"Maria Isabel Arango",t:"A",s:43.4,m:14,l:0,w:7.2,ad:8,aw:5,la:"2026-02-19",di:1,vs:4.0,cs:7.2,ss:7.2,rs:25},
  {n:"Ricardo Jaramillo",t:"A",s:42.8,m:4,l:0,w:15.2,ad:2,aw:1,la:"2026-02-15",di:5,vs:1.1,cs:1.4,ss:15.2,rs:25},
  {n:"Barry",t:"A",s:42.3,m:7,l:1,w:7.6,ad:6,aw:4,la:"2026-02-20",di:1,vs:2.0,cs:5.7,ss:9.6,rs:25},
  {n:"Antonioooo",t:"A",s:41.9,m:15,l:0,w:11.9,ad:10,aw:4,la:"2026-02-11",di:9,vs:4.3,cs:5.7,ss:11.9,rs:20},
  {n:"Juan Saldarriaga",t:"A",s:41.7,m:1,l:1,w:13.0,ad:1,aw:1,la:"2026-02-18",di:2,vs:0.3,cs:1.4,ss:15.0,rs:25},
  {n:"Martin Pelaez",t:"B",s:39.8,m:4,l:2,w:6.8,ad:2,aw:2,la:"2026-02-18",di:2,vs:1.1,cs:2.9,ss:10.8,rs:25},
  {n:"Alejandro Pérez",t:"B",s:39.5,m:6,l:3,w:2.5,ad:5,aw:3,la:"2026-02-19",di:1,vs:1.7,cs:4.3,ss:8.5,rs:25},
  {n:"Luis Alberto Botero",t:"B",s:38.2,m:4,l:1,w:5.8,ad:3,aw:3,la:"2026-02-19",di:1,vs:1.1,cs:4.3,ss:7.8,rs:25},
  {n:"Ricardo Espinal",t:"B",s:38.2,m:6,l:0,w:7.2,ad:3,aw:3,la:"2026-02-19",di:1,vs:1.7,cs:4.3,ss:7.2,rs:25},
  {n:"Wilder Zapata",t:"B",s:36.8,m:3,l:2,w:2.7,ad:3,aw:3,la:"2026-02-16",di:4,vs:0.9,cs:4.3,ss:6.7,rs:25},
  {n:"Jorge Campuzano",t:"B",s:34.8,m:8,l:1,w:6.2,ad:5,aw:3,la:"2026-02-08",di:12,vs:2.3,cs:4.3,ss:8.2,rs:20},
  {n:"Agustin Argentino",t:"B",s:24.3,m:14,l:2,w:10.6,ad:7,aw:4,la:"2025-12-15",di:67,vs:4.0,cs:5.7,ss:14.6,rs:0},
  {n:"Carolina Rojas Gómez",t:"B",s:24.0,m:4,l:1,w:130.5,ad:2,aw:2,la:"2025-12-07",di:75,vs:1.1,cs:2.9,ss:20,rs:0},
  {n:"Eduardo Sagues",t:"B",s:22.7,m:1,l:0,w:1.0,ad:1,aw:1,la:"2026-02-09",di:11,vs:0.3,cs:1.4,ss:1.0,rs:20},
  {n:"Andres Bilbao",t:"B",s:22.3,m:3,l:1,w:28.0,ad:1,aw:1,la:"2025-11-30",di:82,vs:0.9,cs:1.4,ss:20,rs:0},
  {n:"Rafael Troconis Llave",t:"B",s:22.3,m:3,l:1,w:98.7,ad:1,aw:1,la:"2025-12-05",di:77,vs:0.9,cs:1.4,ss:20,rs:0},
  {n:"Roberto Cuartas",t:"B",s:21.7,m:1,l:0,w:42.0,ad:1,aw:1,la:"2025-11-25",di:87,vs:0.3,cs:1.4,ss:20,rs:0},
  {n:"Mauricio Ortega",t:"C",s:14.7,m:1,l:0,w:13.0,ad:1,aw:1,la:"2025-12-01",di:81,vs:0.3,cs:1.4,ss:13.0,rs:0},
  {n:"Jorge Saldarriaga",t:"C",s:14.7,m:1,l:0,w:13.0,ad:1,aw:1,la:"2025-12-13",di:69,vs:0.3,cs:1.4,ss:13.0,rs:0},
  {n:"Eduardo Llopis",t:"C",s:13.3,m:7,l:1,w:6.4,ad:3,aw:2,la:"2025-12-11",di:71,vs:2.0,cs:2.9,ss:8.4,rs:0},
  {n:"Mama",t:"C",s:12.7,m:1,l:0,w:11.0,ad:1,aw:1,la:"2025-12-17",di:65,vs:0.3,cs:1.4,ss:11.0,rs:0},
  {n:"Felo",t:"C",s:10.7,m:3,l:0,w:7.0,ad:3,aw:2,la:"2025-12-17",di:65,vs:0.9,cs:2.9,ss:7.0,rs:0},
  {n:"Squiz Medina",t:"C",s:6.7,m:1,l:0,w:5.0,ad:1,aw:1,la:"2025-12-17",di:65,vs:0.3,cs:1.4,ss:5.0,rs:0},
  {n:"Juancho Tirado",t:"C",s:5.4,m:2,l:0,w:2.0,ad:2,aw:2,la:"2025-12-11",di:71,vs:0.6,cs:2.9,ss:2.0,rs:0},
  {n:"Musimbi",t:"C",s:4.7,m:1,l:1,w:1.0,ad:1,aw:1,la:"2025-11-25",di:87,vs:0.3,cs:1.4,ss:3.0,rs:0},
  {n:"David Muñoz",t:"C",s:2.7,m:1,l:0,w:1.0,ad:1,aw:1,la:"2025-11-29",di:83,vs:0.3,cs:1.4,ss:1.0,rs:0},
  {n:"Alejandra Zapata Coninsa",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Alejo Molina",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Amalia AAA Londoño",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Amalia Uribe Gustavo Villa Gumroad",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Ana Arango",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"André Joffry",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Blanket",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Carlos Mazo",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"catalina botero",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Checho Aguirre",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Claudia restrepo Rectora",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Damian Llave De lucas jaramillo",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Daniel Arango",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Daniel Martinez",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Diego Kuri",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Diego Mazo",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Douglas Rueda Buche",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Federico Molina",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Germancito Primo Ricky Uribe",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Gonzalo teso",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Jackie Yanovich",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Juliana M Novia Santi",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Luisk",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Manu Cuñada beto",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Mariana Botero",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Melissa P",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Miguel Botero",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Mimi",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Pablo Arboleda",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Pablo Botero Londoño",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Paola Betancur Vargas",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Paola Macia Fernandez",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Pedro Faria",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Ricardo Kuri",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Rigo Uran",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"SA Santiago Arango",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"santiago lopez",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Sergio Jaramillo",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
  {n:"Tomas Restrepo Amigo Mazo F2 Y F3",t:"Z",s:0,m:0,l:0,w:0,ad:0,aw:0,la:"never",di:96,vs:0,cs:0,ss:0,rs:0},
];

const TC={A:{label:"Active",color:"#10b981",bg:"#052e16",bgL:"#064e3b",icon:"⚡"},B:{label:"Watch",color:"#f59e0b",bg:"#422006",bgL:"#78350f",icon:"👁"},C:{label:"Remove",color:"#ef4444",bg:"#450a0a",bgL:"#7f1d1d",icon:"🪓"},Z:{label:"Zombie",color:"#6b21a8",bg:"#2e1065",bgL:"#4c1d95",icon:"🧟"}};

function kpis(d){const nn=d.length,tot=d.reduce((a,x)=>a+x.m,0),lnk=d.reduce((a,x)=>a+x.l,0);const you=d.find(x=>x.u),yM=you?.m||0,yL=you?.l||0;const c5=d.filter(x=>x.m>=5).length;const a7=d.filter(x=>x.di<=7).length;const deep=d.filter(x=>x.w>=15).length;const lk=d.filter(x=>x.l>=3).length;const sh=d.map(x=>x.m/tot),ent=-sh.reduce((a,p)=>a+(p>0?p*Math.log2(p):0),0);const subM=d.filter(x=>x.w>=10).reduce((a,x)=>a+x.m,0);const tw=d.reduce((a,x)=>a+(x.w*x.m),0);const noY=d.filter(x=>!x.u);const t5=[...noY].sort((a,b)=>b.m-a.m).slice(0,5);const t5m=t5.reduce((a,x)=>a+x.m,0);const lurk=d.filter(x=>x.m<3).length;const avgW=d.reduce((a,x)=>a+x.aw,0)/nn;return{nn,tot,lnk,yM,yL,c5,a7,deep,lk,kd:ent/Math.log2(nn),sn:subM/tot,nd:lk/nn,fM:yM/tot,fL:yL/lnk,vel:tot/96,dep:tw/tot,t5,t5m,t5p:t5m/(tot-yM),lurk,lurkP:lurk/nn,avgW,dw:d.filter(x=>x.t==="C").length+d.filter(x=>x.t==="B"&&x.di>60).length+d.filter(x=>x.t==="Z").length,tA:d.filter(x=>x.t==="A").length,tB:d.filter(x=>x.t==="B").length,tC:d.filter(x=>x.t==="C").length,tZ:d.filter(x=>x.t==="Z").length};}

const G=({v,mx=1,lb,sub,c,sz=76})=>{const ci=2*Math.PI*29,o=ci*(1-Math.min(v/mx,1));return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><svg width={sz} height={sz} viewBox="0 0 74 74"><circle cx="37" cy="37" r="29" fill="none" stroke="#1a1a2e" strokeWidth="5"/><circle cx="37" cy="37" r="29" fill="none" stroke={c} strokeWidth="5" strokeDasharray={ci} strokeDashoffset={o} strokeLinecap="round" transform="rotate(-90 37 37)" style={{transition:"stroke-dashoffset 1s ease"}}/><text x="37" y="35" textAnchor="middle" fill={c} fontSize="14" fontWeight="700" fontFamily="'JetBrains Mono',monospace">{v<10?v.toFixed(1):Math.round(v)}</text><text x="37" y="46" textAnchor="middle" fill="#6b7280" fontSize="7.5">{sub}</text></svg><div style={{fontSize:9,color:"#9ca3af",textAlign:"center",lineHeight:1.2,maxWidth:82,fontWeight:500}}>{lb}</div></div>);};

const KPI=({icon,title,value,sub,color,alert})=>(<div style={{background:"#111118",borderRadius:10,padding:"11px 13px",border:`1px solid ${alert?color+"40":"#1e1e2e"}`,flex:"1 1 140px",minWidth:140}}><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}><span style={{fontSize:12}}>{icon}</span><span style={{fontSize:9,color:"#6b7280",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>{title}</span></div><div style={{fontSize:21,fontWeight:700,color,fontFamily:"'JetBrains Mono',monospace"}}>{value}</div><div style={{fontSize:10,color:"#6b7280",marginTop:2,lineHeight:1.4}}>{sub}</div></div>);

const Br=({v,mx=100,c})=>(<div style={{width:"100%",height:5,background:"#1a1a2e",borderRadius:3,overflow:"hidden"}}><div style={{width:`${(v/mx)*100}%`,height:"100%",background:c,borderRadius:3,transition:"width 0.6s ease"}}/></div>);

const Mn=({lb,v,mx=30,c})=>(<div style={{flex:1,minWidth:68}}><div style={{fontSize:9,color:"#6b7280",marginBottom:2,letterSpacing:"0.05em"}}>{lb}</div><div style={{fontSize:12,fontWeight:600,color:c,fontFamily:"'JetBrains Mono',monospace"}}>{v.toFixed(1)}</div><div style={{width:"100%",height:3,background:"#1a1a2e",borderRadius:2,marginTop:2}}><div style={{width:`${(v/mx)*100}%`,height:"100%",background:c,borderRadius:2}}/></div></div>);

const Ins=({icon,title,body,color})=>(<div style={{background:"#111118",borderRadius:10,padding:"13px 15px",border:`1px solid ${color}25`,marginBottom:10,display:"flex",gap:11,alignItems:"flex-start"}}><span style={{fontSize:17,flexShrink:0}}>{icon}</span><div><div style={{fontSize:12,fontWeight:600,color,marginBottom:3}}>{title}</div><div style={{fontSize:11,color:"#b0b0c0",lineHeight:1.55}}>{body}</div></div></div>);

const Card=({m,rank,exp,tog})=>{const tc=TC[m.t];return(<div onClick={tog} style={{background:exp?tc.bgL:"#111118",border:`1px solid ${exp?tc.color+"40":"#1e1e2e"}`,borderRadius:10,padding:"10px 13px",cursor:"pointer",transition:"all 0.2s",marginBottom:5}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:28,height:28,borderRadius:"50%",background:tc.bg,border:`2px solid ${tc.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:tc.color,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{rank}</div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span style={{fontWeight:600,color:"#e5e7eb",fontSize:13}}>{m.n}{m.u?" 👑":""}</span><span style={{fontSize:9,padding:"2px 7px",borderRadius:99,fontWeight:600,background:tc.bg,color:tc.color,border:`1px solid ${tc.color}30`}}>{tc.icon} {tc.label}</span></div><div style={{display:"flex",gap:10,marginTop:3}}><span style={{fontSize:10,color:"#9ca3af"}}>{m.m} msgs</span><span style={{fontSize:10,color:"#9ca3af"}}>{m.l} links</span><span style={{fontSize:10,color:m.di>30?"#ef4444":m.di>14?"#f59e0b":"#6b7280"}}>{m.di===0?"today":`${m.di}d ago`}</span></div></div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:17,fontWeight:700,color:tc.color,fontFamily:"'JetBrains Mono',monospace"}}>{m.s.toFixed(0)}</div><div style={{width:52}}><Br v={m.s} c={tc.color}/></div></div></div>{exp&&(<div style={{marginTop:11,paddingTop:9,borderTop:`1px solid ${tc.color}20`}}><div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Mn lb="VOLUME" v={m.vs} mx={30} c="#3b82f6"/><Mn lb="CONSISTENCY" v={m.cs} mx={25} c="#8b5cf6"/><Mn lb="SUBSTANCE" v={m.ss} mx={20} c="#ec4899"/><Mn lb="RECENCY" v={m.rs} mx={25} c="#10b981"/></div><div style={{display:"flex",gap:13,marginTop:7,flexWrap:"wrap"}}>{[["Avg words",m.w],["Active days",`${m.ad}/96`],["Weeks",`${m.aw}/14`],["Last",m.la]].map(([a,b])=>(<div key={a} style={{fontSize:10,color:"#9ca3af"}}><span style={{color:"#6b7280"}}>{a}:</span> {b}</div>))}</div></div>)}</div>);};

export default function App(){
  const[filter,setFilter]=useState("all");const[search,setSearch]=useState("");const[exp,setExp]=useState(null);const[sort,setSort]=useState("score");const[sec,setSec]=useState("intel");
  const k=useMemo(()=>kpis(D),[]);
  const filt=useMemo(()=>{let r=[...D];if(filter!=="all")r=r.filter(x=>x.t===filter);if(search)r=r.filter(x=>x.n.toLowerCase().includes(search.toLowerCase()));if(sort==="score")r.sort((a,b)=>b.s-a.s);else if(sort==="msgs")r.sort((a,b)=>b.m-a.m);else if(sort==="inactive")r.sort((a,b)=>b.di-a.di);else if(sort==="links")r.sort((a,b)=>b.l-a.l);return r;},[filter,search,sort]);
  const goM=(name)=>{setSec("members");setFilter("all");setSearch(name);setExp(name);};

  return(<div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e5e7eb",fontFamily:"'Inter',-apple-system,sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <div style={{padding:"22px 20px 12px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:19,fontWeight:700,letterSpacing:"-0.02em"}}>10AMPRO</span><span style={{fontSize:10,padding:"3px 10px",borderRadius:99,background:"linear-gradient(135deg,#052e16,#1e1e2e)",color:"#10b981",fontWeight:600,border:"1px solid #10b98130"}}>Collective Intelligence</span></div><div style={{fontSize:11,color:"#6b7280",marginTop:3}}>Nov 16 '25 → Feb 21 '26 · {k.nn} total members · {k.tot.toLocaleString()} msgs · 96 days</div></div>
    <div style={{display:"flex",borderBottom:"1px solid #1e1e2e",padding:"0 20px",gap:2}}>{[["intel","🧠 Intelligence"],["insights","💡 Insights"],["robes","⚔️ Robespierre"],["members","👥 Members"]].map(([key,lb])=>(<button key={key} onClick={()=>{setSec(key);if(key!=="members"){setSearch("");setFilter("all");}}} style={{padding:"8px 14px",fontSize:11,fontWeight:600,cursor:"pointer",background:"transparent",border:"none",color:sec===key?"#e5e7eb":"#6b7280",borderBottom:sec===key?"2px solid #10b981":"2px solid transparent"}}>{lb}</button>))}</div>

    {sec==="intel"&&(<div style={{padding:"14px 20px 80px"}}>
      <div style={{background:"#111118",borderRadius:12,padding:"14px 10px",border:"1px solid #1e1e2e",marginBottom:12}}><div style={{fontSize:10,color:"#6b7280",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>🧬 System Learning Health</div><div style={{display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:8}}><G v={k.kd*100} mx={100} lb="Knowledge Distribution" sub="%" c="#8b5cf6"/><G v={k.sn*100} mx={100} lb="Signal-to-Noise" sub="%" c="#10b981"/><G v={k.nd*100} mx={100} lb="Network Density" sub="%" c="#3b82f6"/><G v={(1-k.fM)*100} mx={100} lb="Decentralization" sub="%" c="#f59e0b"/></div></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}><KPI icon="🧠" title="Active Brains" value={k.c5} sub={`${((k.c5/k.nn)*100).toFixed(0)}% contribute 5+ msgs`} color="#10b981"/><KPI icon="🔗" title="Knowledge Inputs" value={k.lnk} sub={`${k.lk} members share sources`} color="#3b82f6"/><KPI icon="⚡" title="Velocity" value={`${k.vel.toFixed(0)}/d`} sub={`${(k.vel*7).toFixed(0)} msgs/week`} color="#8b5cf6"/><KPI icon="📐" title="Depth" value={`${k.dep.toFixed(0)}w`} sub={`avg words · ${k.deep} deep writers`} color="#ec4899"/><KPI icon="🔥" title="7d Pulse" value={k.a7} sub={`${((k.a7/k.nn)*100).toFixed(0)}% active this week`} color="#10b981"/><KPI icon="🪓" title="Dead Weight" value={k.dw} sub="to cut for signal" color="#ef4444" alert/></div>
      <div style={{background:"#111118",borderRadius:12,padding:"14px 12px",border:"1px solid #1e1e2e",marginBottom:12}}><div style={{fontSize:10,color:"#6b7280",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>📊 Learning Flywheel</div>
        {[{lb:"Knowledge Input",d:"External links",v:k.lnk,tg:"1,500+",p:Math.min(k.lnk/1500,1),c:"#3b82f6",dt:`${k.lk} of ${k.nn} share links (${((k.lk/k.nn)*100).toFixed(0)}%)`},{lb:"Processing",d:"Substantive msgs (10+ words)",v:`${(k.sn*100).toFixed(0)}%`,tg:"80%+",p:k.sn/0.8,c:"#10b981",dt:`${k.deep} members write deep analytical messages`},{lb:"Distribution",d:"Brains processing signal",v:k.c5,tg:"50+",p:Math.min(k.c5/50,1),c:"#8b5cf6",dt:`Spread: ${(k.kd*100).toFixed(0)}% of max entropy`},{lb:"Retention",d:"Active within 7 days",v:`${((k.a7/k.nn)*100).toFixed(0)}%`,tg:"85%+",p:(k.a7/k.nn)/0.85,c:"#f59e0b",dt:`${k.a7} of ${k.nn} engaged this week`}].map((x,i)=>(<div key={i} style={{marginBottom:13}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}><div><span style={{fontSize:12,fontWeight:600,color:"#e5e7eb"}}>{x.lb}</span><span style={{fontSize:10,color:"#6b7280",marginLeft:6}}>{x.d}</span></div><div style={{display:"flex",gap:6,alignItems:"baseline"}}><span style={{fontSize:15,fontWeight:700,color:x.c,fontFamily:"'JetBrains Mono',monospace"}}>{x.v}</span><span style={{fontSize:9,color:"#6b7280"}}>/ {x.tg}</span></div></div><div style={{width:"100%",height:5,background:"#1a1a2e",borderRadius:3,overflow:"hidden",marginBottom:3}}><div style={{width:`${Math.min(x.p*100,100)}%`,height:"100%",background:x.p>=1?x.c:`${x.c}99`,borderRadius:3}}/></div><div style={{fontSize:10,color:"#6b7280"}}>{x.dt}</div></div>))}</div>
      <div style={{background:"#111118",borderRadius:12,padding:"14px 12px",border:"1px solid #1e1e2e"}}><div style={{fontSize:10,color:"#6b7280",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>🏆 Top Knowledge Nodes (ex-founder)</div>{D.filter(x=>!x.u).sort((a,b)=>{const sa=(a.l*3)+(a.w*0.5)+(a.aw*2)+a.m*0.1;const sb=(b.l*3)+(b.w*0.5)+(b.aw*2)+b.m*0.1;return sb-sa;}).slice(0,10).map((x,i)=>{const ks=((x.l*3)+(x.w*0.5)+(x.aw*2)+x.m*0.1).toFixed(0);return(<div key={x.n} onClick={()=>goM(x.n)} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 4px",borderBottom:i<9?"1px solid #1a1a2e":"none",cursor:"pointer",borderRadius:6}} onMouseEnter={e=>e.currentTarget.style.background="#1a1a2e"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><div style={{width:22,height:22,borderRadius:"50%",background:i<3?"#052e16":"#1a1a2e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:i<3?"#10b981":"#6b7280",fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{i+1}</div><div style={{flex:1}}><span style={{fontSize:12,fontWeight:500,color:"#e5e7eb"}}>{x.n}</span></div><div style={{display:"flex",gap:12,alignItems:"center",fontSize:10,color:"#9ca3af"}}><span>🔗{x.l}</span><span>💬{x.m}</span><span>{x.w.toFixed(0)}w</span><span style={{color:"#10b981",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{ks}</span></div></div>);})}</div>
    </div>)}

    {sec==="insights"&&(<div style={{padding:"14px 20px 80px"}}>
      <div style={{background:"#111118",borderRadius:12,padding:"14px 12px",border:"1px solid #f59e0b25",marginBottom:14}}><div style={{fontSize:10,color:"#f59e0b",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>⚠️ Founder Dependency Analysis</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>{[{lb:"Message Share",v:`${(k.fM*100).toFixed(0)}%`,tg:"<15%",bad:k.fM>0.15,c:"#f59e0b"},{lb:"Link Share",v:`${(k.fL*100).toFixed(0)}%`,tg:"<20%",bad:k.fL>0.2,c:"#ef4444"},{lb:"Your Msgs",v:k.yM.toLocaleString(),tg:null,bad:false,c:"#8b5cf6"},{lb:"Your Links",v:k.yL,tg:null,bad:false,c:"#3b82f6"}].map(x=>(<div key={x.lb} style={{flex:"1 1 80px",minWidth:80,background:x.bad?"#422006":"#0a0a0f",borderRadius:8,padding:"9px 11px",border:`1px solid ${x.bad?x.c+"30":"#1e1e2e"}`}}><div style={{fontSize:9,color:"#6b7280",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>{x.lb}</div><div style={{fontSize:19,fontWeight:700,color:x.c,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{x.v}</div>{x.tg&&<div style={{fontSize:9,color:x.bad?"#ef4444":"#10b981",marginTop:2}}>target: {x.tg}</div>}</div>))}</div>
        <div style={{fontSize:11,color:"#d4a574",lineHeight:1.6,padding:"10px 12px",background:"#422006",borderRadius:8,border:"1px solid #f59e0b20"}}><strong style={{color:"#f59e0b"}}>What this means:</strong> You're the brain, curator, and energy source. If you stop posting for a week, knowledge input drops by more than half. This isn't collective intelligence yet — it's a broadcast channel with a comment section.<br/><br/><strong style={{color:"#f59e0b"}}>How to fix:</strong> Assign "weekly curator" roles to your top 5 contributors. Ask them to each share 3 links/week. Challenge <span onClick={()=>goM("Andres Felipe Arias")} style={{textDecoration:"underline",cursor:"pointer"}}>Andres Felipe</span>, <span onClick={()=>goM("gordo Barato")} style={{textDecoration:"underline",cursor:"pointer"}}>gordo Barato</span>, <span onClick={()=>goM("Lucas Jaramillo")} style={{textDecoration:"underline",cursor:"pointer"}}>Lucas</span>, <span onClick={()=>goM("Fede Suarez")} style={{textDecoration:"underline",cursor:"pointer"}}>Fede</span>, and <span onClick={()=>goM("Dario Palacio")} style={{textDecoration:"underline",cursor:"pointer"}}>Dario</span> to match your link output.</div></div>

      <Ins icon="📊" title={`Top 5 Concentration: ${(k.t5p*100).toFixed(0)}% of non-founder msgs`} color="#8b5cf6" body={`${k.t5.map(x=>x.n).join(", ")} generate ${k.t5m.toLocaleString()} of ${(k.tot-k.yM).toLocaleString()} non-founder messages. Strong core — but the remaining ${k.tA-6} Tier A members average only ${((k.tot-k.yM-k.t5m)/(k.tA-6)).toFixed(0)} msgs each. The long tail needs activation.`}/>
      <Ins icon="👻" title={`Lurker Ratio: ${(k.lurkP*100).toFixed(0)}% have <3 messages`} color="#ef4444" body={`${k.lurk} of ${k.nn} members posted fewer than 3 messages in 96 days. Consuming signal without contributing back. Every node in a collective intelligence system should both receive AND transmit.`}/>
      <Ins icon="📐" title={`Signal Quality: ${k.deep} deep writers (${((k.deep/k.nn)*100).toFixed(0)}%)`} color="#ec4899" body={`Members averaging 15+ words/msg are your analytical engines. Standouts: Daniel Bermúdez (77.5w), Simón Restrepo (60.6w), Rafael Troconis (49.2w), Peter Alexander (39.5w), Molo Villa (39.5w). Challenge them to post original theses, not just reactions.`}/>
      <Ins icon="🔗" title={`Knowledge Input Diversity: ${k.lk} of ${k.nn} share links`} color="#3b82f6" body={`Only ${((k.lk/k.nn)*100).toFixed(0)}% bring in external knowledge. gordo Barato leads with 135 links. Andres Felipe (85), Dario (59), Nathanel (38), Lucas (33) round out the top. The group's information diet depends on ~${k.lk} curators feeding ${k.nn} consumers.`}/>
      <Ins icon="📅" title={`Consistency: avg ${k.avgW.toFixed(1)} of 14 weeks active`} color="#f59e0b" body={`${D.filter(x=>x.aw<=2).length} members were active only 1-2 weeks total — they came, saw, and essentially left. Consistency matters more than volume. 5 thoughtful msgs/week > 50 msgs in one burst.`}/>
      <Ins icon="🚌" title="Bus Factor: 1" color="#ef4444" body={`If Hernán stops posting, the group loses ${(k.fM*100).toFixed(0)}% of messages and ${(k.fL*100).toFixed(0)}% of links overnight. If Hernán + top 5 stop, the group loses 60%+ of all activity. Goal: raise bus factor to 5 by distributing curation and discussion leadership.`}/>

      <div style={{background:"#052e16",borderRadius:12,padding:"14px 12px",border:"1px solid #10b98130",marginTop:4}}><div style={{fontSize:10,color:"#10b981",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>🎯 Actionable Plays</div>
        {[{n:"1",t:"Cut dead weight NOW",d:`Remove ${k.tZ} zombies + ${k.tC} Tier C + ${D.filter(x=>x.t==="B"&&x.di>60).length} dormant Tier B = ${k.tZ+k.tC+D.filter(x=>x.t==="B"&&x.di>60).length} total cuts. Instant signal improvement.`},{n:"2",t:"Weekly Curator Rotation",d:"Top 5 non-founder each curate 3 links/week on rotating topics (macro, crypto, AI, latam, wild card)."},{n:"3",t:"Activate the Long Tail",d:`${D.filter(x=>x.t==="A"&&x.m<20&&x.m>=5).length} Tier A members have 5-20 msgs. Tag them directly. Ask for their take. Make silence uncomfortable.`},{n:"4",t:"Thursday Thesis Drop",d:"Weekly ritual: 3 members post a 1-paragraph investment thesis. Rotate who's on deck. Creates accountability."},{n:"5",t:"Quarterly Audit",d:"Re-run this analysis every 90 days. Track founder dependency ↓, unique contributors ↑, links/week ↑."}].map(x=>(<div key={x.n} style={{display:"flex",gap:10,marginBottom:9,alignItems:"flex-start"}}><div style={{width:20,height:20,borderRadius:"50%",background:"#10b98120",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#10b981",fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{x.n}</div><div><div style={{fontSize:11,fontWeight:600,color:"#e5e7eb"}}>{x.t}</div><div style={{fontSize:10,color:"#9ca3af",lineHeight:1.5,marginTop:1}}>{x.d}</div></div></div>))}</div>
    </div>)}


    {sec==="robes"&&(<div style={{padding:"14px 20px 80px"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1a0a0a,#2e1065)",borderRadius:12,padding:"20px 16px",border:"1px solid #6b21a830",marginBottom:14}}>
        <div style={{fontSize:18,fontWeight:700,color:"#dc2626",marginBottom:6}}>⚔️ La Guillotina</div>
        <div style={{fontSize:12,color:"#e5a0a0",lineHeight:1.6}}>
          "Old/repetido = Guillotina" — Group rule since Jan 21, 2026.<br/>
          Members below contributed zero signal to collective intelligence. They consumed without contributing, shared junk food sources, or simply disappeared. The revolution demands participation.
        </div>
      </div>

      {/* Execution Stats */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        <div style={{flex:"1 1 100px",background:"#450a0a",borderRadius:10,padding:"12px 14px",border:"1px solid #dc262630"}}>
          <div style={{fontSize:9,color:"#ef4444",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>Zombies</div>
          <div style={{fontSize:28,fontWeight:700,color:"#ef4444",fontFamily:"'JetBrains Mono',monospace"}}>{k.tZ}</div>
          <div style={{fontSize:10,color:"#ef444499"}}>Never typed once</div>
        </div>
        <div style={{flex:"1 1 100px",background:"#450a0a",borderRadius:10,padding:"12px 14px",border:"1px solid #dc262630"}}>
          <div style={{fontSize:9,color:"#f97316",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>Tier C</div>
          <div style={{fontSize:28,fontWeight:700,color:"#f97316",fontFamily:"'JetBrains Mono',monospace"}}>{k.tC}</div>
          <div style={{fontSize:10,color:"#f9731699"}}>Posted then vanished</div>
        </div>
        <div style={{flex:"1 1 100px",background:"#422006",borderRadius:10,padding:"12px 14px",border:"1px solid #f59e0b30"}}>
          <div style={{fontSize:9,color:"#f59e0b",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>Dormant B</div>
          <div style={{fontSize:28,fontWeight:700,color:"#f59e0b",fontFamily:"'JetBrains Mono',monospace"}}>{D.filter(x=>x.t==="B"&&x.di>60).length}</div>
          <div style={{fontSize:10,color:"#f59e0b99"}}>60+ days silent</div>
        </div>
        <div style={{flex:"1 1 100px",background:"#1a0a2e",borderRadius:10,padding:"12px 14px",border:"1px solid #dc262640"}}>
          <div style={{fontSize:9,color:"#dc2626",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>Total Executed</div>
          <div style={{fontSize:28,fontWeight:700,color:"#dc2626",fontFamily:"'JetBrains Mono',monospace"}}>{k.tZ+k.tC+D.filter(x=>x.t==="B"&&x.di>60).length}</div>
          <div style={{fontSize:10,color:"#dc262699"}}>{((k.tZ+k.tC+D.filter(x=>x.t==="B"&&x.di>60).length)/k.nn*100).toFixed(0)}% of group</div>
        </div>
      </div>

      {/* Crimes Against Collective Intelligence */}
      <div style={{background:"#111118",borderRadius:12,padding:"16px 14px",border:"1px solid #1e1e2e",marginBottom:14}}>
        <div style={{fontSize:10,color:"#dc2626",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>📜 Crimes Against Collective Intelligence</div>
        {[
          {crime:"Zero Participation",pen:"Immediate execution",icon:"🧟",desc:"Never posted a single message in 96 days. Pure consumer, zero contributor.",count:k.tZ},
          {crime:"Abandonment",pen:"Immediate execution",icon:"💀",desc:"Posted 1-7 messages then went silent 65+ days. Showed up, saw the alpha, left without contributing.",count:k.tC},
          {crime:"Dormancy",pen:"Execution pending probe",icon:"😴",desc:"Had some activity but 60+ days inactive. Given chance to respond to engagement probe before guillotine.",count:D.filter(x=>x.t==="B"&&x.di>60).length},
        ].map((c,i)=>(<div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<2?"1px solid #1e1e2e":"none",alignItems:"flex-start"}}>
          <span style={{fontSize:24,flexShrink:0}}>{c.icon}</span>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
              <span style={{fontSize:13,fontWeight:600,color:"#e5e7eb"}}>{c.crime}</span>
              <span style={{fontSize:16,fontWeight:700,color:"#ef4444",fontFamily:"'JetBrains Mono',monospace"}}>{c.count}</span>
            </div>
            <div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{c.desc}</div>
            <div style={{fontSize:10,color:"#ef4444",marginTop:4,fontWeight:600}}>Sentence: {c.pen}</div>
          </div>
        </div>))}
      </div>

      {/* Future Crimes - Signal Quality */}
      <div style={{background:"#111118",borderRadius:12,padding:"16px 14px",border:"1px solid #f59e0b25",marginBottom:14}}>
        <div style={{fontSize:10,color:"#f59e0b",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>🔮 Future Guillotine Offenses (Next Audit)</div>
        {[
          {crime:"Junk Food Sharing",desc:"Instagram/TikTok links = information junk food. -2 signal points per link. gordo Barato exempt (10AMPRO content creator).",stat:"16 IG + 14 TikTok links found this period"},
          {crime:"Stale Content",desc:'Sharing old/repetido content the group has already processed. Community flags ("esto es viejo??") trigger -1 on sharer.',stat:'Group rule since Jan 21: "Old/repetido = Guillotina"'},
          {crime:"Lurking Without Learning",desc:"Reading everything, contributing nothing. 96 days of silence = you\'re not learning, you\'re spectating.",stat:`${D.filter(x=>x.m>0&&x.m<3&&x.t!=="Z").length} members posted <3 msgs in 96 days`},
        ].map((c,i)=>(<div key={i} style={{padding:"10px 0",borderBottom:i<2?"1px solid #1e1e2e":"none"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#f59e0b"}}>{c.crime}</div>
          <div style={{fontSize:11,color:"#9ca3af",marginTop:2,lineHeight:1.5}}>{c.desc}</div>
          <div style={{fontSize:10,color:"#6b7280",marginTop:4,fontStyle:"italic"}}>{c.stat}</div>
        </div>))}
      </div>

      {/* Source Quality Report */}
      <div style={{background:"#111118",borderRadius:12,padding:"16px 14px",border:"1px solid #1e1e2e",marginBottom:14}}>
        <div style={{fontSize:10,color:"#10b981",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>📡 Group Information Diet</div>
        {[
          {src:"X / Twitter",count:754,pct:76,color:"#3b82f6",verdict:"Primary alpha channel ✓"},
          {src:"YouTube",count:151,pct:15,color:"#8b5cf6",verdict:"Deep content ✓"},
          {src:"Substack",count:71,pct:7,color:"#10b981",verdict:"Analysis layer ✓"},
          {src:"Instagram",count:16,pct:2,color:"#ef4444",verdict:"Junk food ✗ (-2 per link)"},
          {src:"TikTok",count:14,pct:1,color:"#ef4444",verdict:"Junk food ✗ (-2 per link)"},
          {src:"Bloomberg/Reuters/FT",count:4,pct:0,color:"#f59e0b",verdict:"Premium signal ✓ (need more)"},
        ].map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:i<5?"1px solid #1a1a2e":"none"}}>
          <div style={{width:120,fontSize:11,fontWeight:500,color:"#e5e7eb"}}>{s.src}</div>
          <div style={{flex:1,height:6,background:"#1a1a2e",borderRadius:3,overflow:"hidden"}}><div style={{width:`${Math.min(s.pct*1.3,100)}%`,height:"100%",background:s.color,borderRadius:3}}/></div>
          <div style={{width:40,fontSize:12,fontWeight:700,color:s.color,fontFamily:"'JetBrains Mono',monospace",textAlign:"right"}}>{s.count}</div>
          <div style={{width:130,fontSize:9,color:s.color}}>{s.verdict}</div>
        </div>))}
      </div>

      {/* The Executed - Zombie List */}
      <div style={{background:"#111118",borderRadius:12,padding:"16px 14px",border:"1px solid #6b21a825",marginBottom:14}}>
        <div style={{fontSize:10,color:"#6b21a8",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>🧟 The Executed — Zero Post Zombies ({k.tZ})</div>
        <div style={{fontSize:10,color:"#6b7280",marginBottom:10}}>Joined the group. Never typed a word. 96 days of silence.</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {D.filter(x=>x.t==="Z").sort((a,b)=>a.n.localeCompare(b.n)).map(z=>(<div key={z.n} style={{fontSize:11,padding:"4px 10px",borderRadius:6,background:"#2e1065",color:"#a78bfa",border:"1px solid #6b21a830"}}>{z.n}</div>))}
        </div>
      </div>

      {/* Tier C - The Deserters */}
      <div style={{background:"#111118",borderRadius:12,padding:"16px 14px",border:"1px solid #ef444425",marginBottom:14}}>
        <div style={{fontSize:10,color:"#ef4444",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>💀 The Deserters — Tier C ({k.tC})</div>
        <div style={{fontSize:10,color:"#6b7280",marginBottom:10}}>Posted a few times, then vanished into the void.</div>
        {D.filter(x=>x.t==="C").sort((a,b)=>b.di-a.di).map(m=>(<div key={m.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #1a1a2e"}}>
          <span style={{fontSize:12,color:"#e5e7eb"}}>{m.n}</span>
          <div style={{display:"flex",gap:12,fontSize:10,color:"#9ca3af"}}>
            <span>{m.m} msgs</span>
            <span style={{color:"#ef4444"}}>{m.di}d silent</span>
          </div>
        </div>))}
      </div>

      {/* Dormant Tier B - On Death Row */}
      <div style={{background:"#111118",borderRadius:12,padding:"16px 14px",border:"1px solid #f59e0b25",marginBottom:14}}>
        <div style={{fontSize:10,color:"#f59e0b",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>😴 Death Row — Dormant Tier B ({D.filter(x=>x.t==="B"&&x.di>60).length})</div>
        <div style={{fontSize:10,color:"#6b7280",marginBottom:10}}>Had potential. Went dark 60+ days. One probe away from the guillotine.</div>
        {D.filter(x=>x.t==="B"&&x.di>60).sort((a,b)=>b.di-a.di).map(m=>(<div key={m.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #1a1a2e"}}>
          <span style={{fontSize:12,color:"#e5e7eb"}}>{m.n}</span>
          <div style={{display:"flex",gap:12,fontSize:10,color:"#9ca3af"}}>
            <span>{m.m} msgs</span>
            <span>{m.s.toFixed(0)} score</span>
            <span style={{color:"#f59e0b"}}>{m.di}d silent</span>
          </div>
        </div>))}
      </div>

      {/* Redemption Path */}
      <div style={{background:"#052e16",borderRadius:12,padding:"16px 14px",border:"1px solid #10b98130"}}>
        <div style={{fontSize:10,color:"#10b981",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>🔄 Path to Redemption</div>
        <div style={{fontSize:11,color:"#a0d4b8",lineHeight:1.6}}>
          The revolution is firm but fair. Executed members may petition for re-entry by meeting ALL of the following:
        </div>
        <div style={{marginTop:10}}>
          {[
            "DM the founder with a 1-paragraph thesis on any current investment topic",
            "Commit to sharing minimum 2 quality links per week (no IG/TikTok)",
            "Engage in at least 3 discussions per week for the first month",
            "Accept that a second execution is permanent — no appeals",
          ].map((r,i)=>(<div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
            <span style={{fontSize:11,color:"#10b981",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{i+1}.</span>
            <span style={{fontSize:11,color:"#a0d4b8"}}>{r}</span>
          </div>))}
        </div>
      </div>
    </div>)}

    {sec==="members"&&(<>
      <div style={{padding:"12px 20px 0",display:"flex",gap:8,flexWrap:"wrap"}}>{[["Active",k.tA,"#10b981","#052e16"],["Watch",k.tB,"#f59e0b","#422006"],["Remove",k.tC,"#ef4444","#450a0a"],["Zombie",k.tZ,"#6b21a8","#2e1065"]].map(([lb,ct,c,bg])=>(<div key={lb} style={{flex:1,minWidth:85,padding:"9px 12px",borderRadius:8,background:bg,border:`1px solid ${c}25`}}><div style={{fontSize:20,fontWeight:700,color:c,fontFamily:"'JetBrains Mono',monospace"}}>{ct}</div><div style={{fontSize:10,color:c,opacity:0.7,fontWeight:500}}>{lb}</div></div>))}</div>
      <div style={{padding:"10px 20px",display:"flex",flexDirection:"column",gap:8}}>
        <input type="text" placeholder="Search members..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,background:"#111118",border:"1px solid #1e1e2e",color:"#e5e7eb",fontSize:12,outline:"none",boxSizing:"border-box"}}/>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {[["all","All"],["A","⚡ Active"],["B","👁 Watch"],["C","🪓 Remove"],["Z","🧟 Zombie"]].map(([key,lb])=>(<button key={key} onClick={()=>setFilter(key)} style={{padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:600,border:"1px solid",cursor:"pointer",background:filter===key?(key==="all"?"#1e1e2e":TC[key]?.bg||"#1e1e2e"):"transparent",color:filter===key?(key==="all"?"#e5e7eb":TC[key]?.color||"#e5e7eb"):"#6b7280",borderColor:filter===key?(key==="all"?"#374151":(TC[key]?.color||"")+"40"):"#1e1e2e"}}>{lb}</button>))}
          <div style={{flex:1}}/>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"5px 8px",borderRadius:6,fontSize:11,background:"#111118",border:"1px solid #1e1e2e",color:"#9ca3af",cursor:"pointer"}}><option value="score">Sort: Score</option><option value="msgs">Sort: Messages</option><option value="links">Sort: Links</option><option value="inactive">Sort: Most Inactive</option></select>
        </div>
      </div>
      <div style={{padding:"0 20px 80px"}}><div style={{fontSize:10,color:"#6b7280",marginBottom:6,fontWeight:500}}>{filt.length} member{filt.length!==1?"s":""}</div>{filt.map((m,i)=>(<Card key={m.n} m={m} rank={i+1} exp={exp===m.n} tog={()=>setExp(exp===m.n?null:m.n)}/>))}</div>
    </>)}
  </div>);
}
