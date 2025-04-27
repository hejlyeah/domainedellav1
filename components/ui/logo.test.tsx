import { render, screen } from "@testing-library/react"
import { Logo } from "./logo"

describe("Logo", () => {
  it("renders horizontal black logo by default", () => {
    render(<Logo />)
    const img = screen.getByAltText("Domaine Della")
    expect(img).toHaveAttribute("src", expect.stringContaining("XIHG8"))
  })

  it("renders vertical white logo when specified", () => {
    render(<Logo orientation="vertical" variant="white" />)
    const img = screen.getByAltText("Domaine Della")
    expect(img).toHaveAttribute("src", expect.stringContaining("dXt9f"))
  })

  it("renders with custom dimensions", () => {
    render(<Logo width={400} height={80} />)
    const img = screen.getByAltText("Domaine Della")
    expect(img).toHaveAttribute("width", "400")
    expect(img).toHaveAttribute("height", "80")
  })
})

