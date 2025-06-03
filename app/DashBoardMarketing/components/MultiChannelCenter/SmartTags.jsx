"use client";
import { MultiSelect } from "@mantine/core";
import { useState, useEffect } from "react";

const SmartTags = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch('/tags.json')
      .then(res => res.json())
      .then(data => setTags(data));
  }, []);

  return (
    <MultiSelect
      label="تصنيف العملاء"
      data={tags}
      value={selectedTags}
      onChange={setSelectedTags}
      searchable
      creatable
    />
  );
};
export default SmartTags;