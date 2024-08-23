export class WordThreeValidator {
  private isString(value: Array<any>) {
    let isString = true;
    value.forEach((val) => {
      if (typeof val !== "string") {
        isString = false;
      }
    });
    return isString;
  }
  private validateRecursevely(valueInCheck: object | Array<any>): boolean {
    const checked: Array<boolean> = [];
    if (typeof valueInCheck === "object" && !Array.isArray(valueInCheck)) {
      for (const key in valueInCheck) {
        checked.push(this.validateRecursevely(valueInCheck[key]));
      }
    }
    if (Array.isArray(valueInCheck)) {
      checked.push(this.isString(valueInCheck));
    }

    return !checked.includes(false) && checked.length !== 0;
  }
  isValid(values: any): boolean {
    let isValid = false;
    if (!Array.isArray(values)) isValid = true;
    isValid = this.validateRecursevely(values);

    return isValid;
  }
}
