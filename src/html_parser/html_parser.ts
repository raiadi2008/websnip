import { VOID_ELEMENTS } from "../constants/constants"
import { HtmlClassInfoInterface } from "../types/types"

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
export function getAncestorHtml(target: HTMLElement): string {
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
}

export const getAncestorHtml = (target: HTMLElement): Map<string, string> => {
  classMap.clear()
  classNumber = 0
  addNewClassNamesToHtml(target)
  return classMap
}
