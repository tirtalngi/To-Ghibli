import { type NextRequest, NextResponse } from "next/server"

/** async function img2Ghibli(buffer: Buffer) {
  try {
    
    const axios = require('axios');
    const { Quax } = require('@zanixongroup/uploader');
    const newURL = await Quax(buffer);
    const { data } = await axios.get('https://this-not.vercel.app/?imageUrl=' + newURL);

    return {
      success: true,
      convertedImageUrl: data.result,
      originalSize: buffer.length,
      message: "Image successfully converted to Ghibli style!",
    }
  } catch (error) {
    console.error("Error in img2Ghibli:", error)
    throw error
  }
} */

async function img2Ghibli(buffer: Buffer) {
  try {
    
    const axios = require('axios');
    const { Quax } = require('@zanixongroup/uploader');
    const newURL = await Quax(buffer);
    const { data } = await axios.get('https://this-not.vercel.app/v3?imageUrl=' + newURL);

    return {
      success: true,
      originalSize: buffer.length,
      convertedImageUrl: data.result.imageUrl,
      message: "Image successfully converted to Ghibli style!",
    }
  } catch (error) {
    console.error("Error in img2Ghibli:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please upload a valid image file" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await img2Ghibli(buffer)

    return NextResponse.json({
      success: true,
      data: result,
      originalFileName: file.name,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to convert image. Please try again.",
      },
      { status: 500 },
    )
  }
}
