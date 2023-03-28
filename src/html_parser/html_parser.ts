import { VOID_ELEMENTS } from "../constants/constants"
import { HtmlClassInfoInterface } from "../types/types"

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const classMap = new Map<string, string>()

let classNumber = 0

const addNewClassNamesToHtml = (target: Element) => {
  classNumber += 1
  const newClassName = `websnip-genrated-class-${classNumber}`
  target.classList.add(newClassName)
  classMap.set(target.className, newClassName)
  for (const childElement of Array.from(target.children)) {
    addNewClassNamesToHtml(childElement)
  }
}

export const getAncestorHtml = (target: HTMLElement): Map<string, string> => {
  classMap.clear()
  classNumber = 0
  addNewClassNamesToHtml(target)
  return classMap
=======
>>>>>>> c3f43f8 (arrow function changes)
export function getAncestorHtml(target: HTMLElement): string {
=======
=======
>>>>>>> 9d7de45 (fixed changes)
export const getAncestorHtml = (target: HTMLElement): string => {
>>>>>>> 49f9071 (changes)
=======
export const getAncestorHtml = (target: HTMLElement): string => {
>>>>>>> 49f9071 (changes)
  const stack: HTMLElement[] = []
  let currentElement: HTMLElement | null = target
=======
const classMap = new Map<string, string>()
>>>>>>> f58068a (fixed changes)

let classNumber = 0

const addNewClassNamesToHtml = (target: Element) => {
  classNumber += 1
  const newClassName = `websnip-genrated-class-${classNumber}`
  target.classList.add(newClassName)
  classMap.set(target.className, newClassName)
  for (const childElement of Array.from(target.children)) {
    addNewClassNamesToHtml(childElement)
  }
<<<<<<< HEAD
=======

  let result = ""
  const closingTags: string[] = []

  while (stack.length > 0) {
    const element = stack.pop()!
    const tagName = element.tagName.toLowerCase()
    const isVoidElement = VOID_ELEMENTS.includes(tagName)

    let openingTag = `<${tagName}`
    for (const attr of element.attributes) {
      openingTag += ` ${attr.name}="${attr.value}"`
    }
    openingTag += isVoidElement ? "/>" : ">"
    result += openingTag

    if (element === target && !isVoidElement) {
      result += element.innerHTML
    }

    if (!isVoidElement) {
      closingTags.push(`</${tagName}>`)
    }
  }

  while (closingTags.length > 0) {
    result += closingTags.pop()!
  }

  return result
=======
const classMap = new Map<string, string>()

let classNumber = 0

const addNewClassNamesToHtml = (target: Element) => {
  classNumber += 1
  const newClassName = `websnip-genrated-class-${classNumber}`
  target.classList.add(newClassName)
  classMap.set(target.className, newClassName)
  for (const childElement of Array.from(target.children)) {
    addNewClassNamesToHtml(childElement)
  }
>>>>>>> 9d7de45 (fixed changes)
}

export const getAncestorHtml = (target: HTMLElement): Map<string, string> => {
  classMap.clear()
  classNumber = 0
  addNewClassNamesToHtml(target)
  return classMap
<<<<<<< HEAD
=======
>>>>>>> 1a48af3 (fixed changes)
>>>>>>> 9d7de45 (fixed changes)
}
