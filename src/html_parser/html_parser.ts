import { VOID_ELEMENTS } from "../constants/constants"
import { HtmlClassInfoInterface } from "../types/types"

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
}
