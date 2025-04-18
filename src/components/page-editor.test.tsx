import { render, screen, fireEvent } from "@testing-library/react"
import { PageEditor } from "./page-editor"

const mockContent = "Test content"
const mockOnChange = jest.fn()

describe("PageEditor", () => {
  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it("renders with initial content", () => {
    render(<PageEditor content={mockContent} onChange={mockOnChange} />)
    expect(screen.getByRole("textbox")).toHaveValue(mockContent)
  })

  it("calls onChange when content changes", () => {
    render(<PageEditor content={mockContent} onChange={mockOnChange} />)
    const editor = screen.getByRole("textbox")
    fireEvent.change(editor, { target: { value: "New content" } })
    expect(mockOnChange).toHaveBeenCalledWith("New content")
  })

  it("renders placeholder when content is empty", () => {
    render(<PageEditor content="" onChange={mockOnChange} />)
    expect(screen.getByPlaceholderText("Start writing...")).toBeInTheDocument()
  })

  it("maintains focus after content change", () => {
    render(<PageEditor content={mockContent} onChange={mockOnChange} />)
    const editor = screen.getByRole("textbox")
    editor.focus()
    fireEvent.change(editor, { target: { value: "New content" } })
    expect(document.activeElement).toBe(editor)
  })
}) 