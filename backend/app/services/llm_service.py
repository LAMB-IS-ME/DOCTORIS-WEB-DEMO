from __future__ import annotations

from typing import List, Tuple


from typing import List, Tuple

def simple_reply(user_text: str) -> str:
    # Very simple heuristic reply for demo
    if not user_text.strip():
        return "Xin hãy nhập câu hỏi y khoa cụ thể."
    return f"[Demo Answer] Tôi đã nhận câu hỏi: '{user_text}'. Đây là câu trả lời mô phỏng dựa trên dữ liệu demo."

def synthesize_answer(query: str, contexts: List[Tuple[str, str]]) -> str:
	"""
	Demo answer synthesis: echo query and include top snippets with citations.
	contexts: list of (doc_id, snippet)
	"""
	parts = [
		"Tóm tắt trả lời (demo):",
		f"- Câu hỏi: {query}",
	]
	if contexts:
		parts.append("- Trích dẫn:")
		for doc_id, snippet in contexts:
			snippet_clean = snippet[:280].replace("\n", " ")
			parts.append(f"  • {doc_id}: {snippet_clean}")
	else:
		parts.append("- Không tìm thấy tài liệu liên quan trong bản demo.")
	parts.append("\nLưu ý: Đây là bản demo, không thay thế tư vấn y khoa.")
	return "\n".join(parts)

